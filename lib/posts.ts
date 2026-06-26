// lib/posts.ts
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
}

async function getDB(): Promise<any> {
  const { env } = await getCloudflareContext({ async: true });
  const db = (env as any).DB as any | undefined;

  if (!db) {
    throw new Error("D1 binding DB is not available.");
  }

  return db;
}

const parseJSON = (val: string | null | undefined): string[] => {
  try {
    return JSON.parse(val || "[]");
  } catch {
    return [val || ""].filter(Boolean);
  }
};

export async function getPostData(slug: string): Promise<PostData | null> {
  const db = await getDB();

  const { results } = await db
    .prepare("SELECT * FROM posts WHERE slug = ?")
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

  const { results } = await db
    .prepare(
      `
      SELECT 
        slug, 
        title, 
        difficulty, 
        target_role, 
        category, 
        sub_category, 
        tool_stack, 
        question_type, 
        date 
      FROM posts
      `
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

  const { results } = await db
    .prepare(
      `
      SELECT slug, title, difficulty, tool_stack, category 
      FROM posts 
      WHERE slug != ? 
      AND category LIKE ? 
      LIMIT ?
      `
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

  const { results } = await db
    .prepare("SELECT DISTINCT category, target_role, tool_stack FROM posts")
    .all();

  const categories = Array.from(
    new Set(results.flatMap((r: any) => parseJSON(r.category)))
  ).filter((category) => category && category !== "None") as string[];

  const ALLOWED_ROLES = [
    "Automation_QA_Engineer",
    "Manual_QA_Engineer",
    "QA_Leader",
    "Software_Engineer",
  ];

  const roles = Array.from(
    new Set(results.flatMap((r: any) => parseJSON(r.target_role)))
  ).filter(
    (role): role is string => typeof role === "string" && ALLOWED_ROLES.includes(role)
  );

  const ALLOWED_TOOLS = ["Cypress", "Playwright", "Postman", "DevTools"];
  const rawTools = results.map((r: any) => r.tool_stack);

  const tools = Array.from(
    new Set(
      rawTools.map((tool: string) =>
        ALLOWED_TOOLS.includes(tool) ? tool : "Generic"
      )
    )
  ).filter((tool) => tool !== null) as string[];

  return { categories, roles, tools };
}