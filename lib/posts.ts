import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface PostData {
  excerpt?: string;
  slug: string;
  title: string;
  difficulty: string;
  target_role: string[];
  category: string[];
  sub_category: string;
  question_type: string;
  tool_stack: string;
  tags?: string[];
  content?: string;
  date?: string;
  companies: string[];
  status?: string;
  quality_score?: number;
}

const mockDb = {
  prepare: () => ({
    bind: () => ({ all: async () => ({ results: [] }) }),
    all: async () => ({ results: [] }),
  }),
};

export async function getDB(): Promise<any> {
  try {
    const context = await getCloudflareContext({ async: true });
    const env = (context as any).env;
    const db = env?.DB;

    if (!db) {
      console.warn("D1 binding DB is not available, using mock DB.");
      return mockDb;
    }

    return db;
  } catch (error) {
    console.error("Error accessing Cloudflare context:", error);
    return mockDb;
  }
}

const parseJSON = (val: string | null | undefined): string[] => {
  try {
    return JSON.parse(val || "[]");
  } catch {
    return [val || ""].filter(Boolean);
  }
};

async function hasColumn(db: any, table: string, column: string) {
  try {
    const { results } = await db.prepare(`PRAGMA table_info(${table})`).all();
    return Array.isArray(results) && results.some((item: any) => item.name === column);
  } catch {
    return false;
  }
}

async function visibilitySql(db: any, alias = "") {
  const prefix = alias ? `${alias}.` : "";
  return (await hasColumn(db, "posts", "status"))
    ? `COALESCE(${prefix}status, 'published') = 'published'`
    : "1 = 1";
}

export async function getPostData(slug: string): Promise<PostData | null> {
  const db = await getDB();
  const visible = await visibilitySql(db);

  const { results } = await db
    .prepare(`SELECT * FROM posts WHERE slug = ? AND ${visible}`)
    .bind(slug)
    .all();

  if (!results || results.length === 0) return null;

  const post = results[0] as any;

  return {
    ...post,
    target_role: parseJSON(post.target_role),
    category: parseJSON(post.category),
    tags: parseJSON(post.tags || "[]"),
  };
}

export async function getAllPosts() {
  const db = await getDB();
  const visible = await visibilitySql(db);
  const hasQuality = await hasColumn(db, "posts", "quality_score");

  const { results } = await db
    .prepare(
      `SELECT
        slug,
        title,
        difficulty,
        target_role,
        category,
        sub_category,
        tool_stack,
        question_type,
        date${hasQuality ? ", quality_score" : ""}
      FROM posts
      WHERE ${visible}
      ORDER BY ${hasQuality ? "COALESCE(quality_score, 0) DESC," : ""} datetime(date) DESC, title ASC`
    )
    .all();

  return results.map((post: any) => ({
    ...post,
    target_role: parseJSON(post.target_role),
    category: parseJSON(post.category),
  }));
}

export async function getRelatedPosts(
  currentSlug: string,
  currentCategory: string,
  limit: number = 3
) {
  const db = await getDB();
  const visible = await visibilitySql(db);

  const { results } = await db
    .prepare(
      `SELECT slug, title, difficulty, tool_stack, category
      FROM posts
      WHERE slug != ?
      AND category LIKE ?
      AND ${visible}
      LIMIT ?`
    )
    .bind(currentSlug, `%${currentCategory}%`, limit)
    .all();

  return results.map((post: any) => ({
    ...post,
    category: parseJSON(post.category),
  }));
}

export async function getNavbarData() {
  const db = await getDB();
  const visible = await visibilitySql(db);

  const { results } = await db
    .prepare(
      `SELECT DISTINCT category, target_role, interview_source, tool_stack
      FROM posts
      WHERE ${visible}`
    )
    .all();

  const categories = Array.from(
    new Set(results.flatMap((row: any) => parseJSON(row.category)))
  ).filter((category) => category && category !== "None") as string[];

  const allowedRoles = [
    "Automation_QA_Engineer",
    "Manual_QA_Engineer",
    "QA_Leader",
    "Software_Engineer",
  ];

  const roles = Array.from(
    new Set(results.flatMap((row: any) => parseJSON(row.target_role)))
  ).filter(
    (role): role is string => typeof role === "string" && allowedRoles.includes(role)
  );

  const allowedTools = ["Cypress", "Playwright", "Postman", "DevTools"];
  const tools = Array.from(
    new Set(
      results.map((row: any) =>
        allowedTools.includes(row.tool_stack) ? row.tool_stack : "Generic"
      )
    )
  ).filter(Boolean) as string[];

  const companies = Array.from(
    new Set(results.map((row: any) => row.interview_source))
  ).filter(Boolean) as string[];

  return { categories, roles, tools, companies };
}
