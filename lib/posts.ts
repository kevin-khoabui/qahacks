// lib/posts.ts
import { getRequestContext } from '@cloudflare/next-on-pages';

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

function getDB(): D1Database {
  return (getRequestContext().env as any).DB;
}

/**
 * Hàm parseJSON an toàn cho dữ liệu đã chuẩn hóa trong DB
 * Dữ liệu hiện tại ở dạng: ["Value_With_Underscore"]
 */
const parseJSON = (val: string): string[] => {
  try {
    return JSON.parse(val || '[]');
  } catch {
    return [val].filter(Boolean);
  }
};

export async function getPostData(slug: string): Promise<PostData | null> {
  const db = getDB();
  const { results } = await db.prepare("SELECT * FROM posts WHERE slug = ?")
    .bind(slug)
    .all();

  if (!results || results.length === 0) return null;

  const post = results[0] as any;

  return {
    ...post,
    target_role: parseJSON(post.target_role),
    category: parseJSON(post.category),
    tags: parseJSON(post.tags || '[]')
  };
}

export async function getAllPosts() {
  const db = getDB();
  const { results } = await db.prepare(
    "SELECT slug, title, difficulty, target_role, category, sub_category, tool_stack, question_type, date FROM posts"
  ).all();

  return results.map((post: any) => ({
    ...post,
    target_role: parseJSON(post.target_role),
    category: parseJSON(post.category),
  }));
}

export async function getRelatedPosts(currentSlug: string, currentCategory: string, limit: number = 3) {
  const db = getDB();
  // Tìm kiếm theo Category đã chuẩn hóa
  const { results } = await db.prepare(
    "SELECT slug, title, difficulty, tool_stack, category FROM posts WHERE slug != ? AND category LIKE ? LIMIT ?"
  )
    .bind(currentSlug, `%${currentCategory}%`, limit)
    .all();

  return results.map((post: any) => ({
    ...post,
    category: parseJSON(post.category),
  }));
}

export async function getNavbarData() {
  const db = getDB();
  const { results } = await db.prepare(
    "SELECT DISTINCT category, target_role, tool_stack FROM posts"
  ).all();

  // 1. Categories: Lấy danh sách duy nhất từ mảng JSON
  const categories = Array.from(new Set(results.flatMap((r: any) => parseJSON(r.category))))
    .filter(c => c && c !== "None") as string[];
    
  // 2. Roles: Chỉ lấy các role đã định nghĩa để đảm bảo Route luôn tồn tại
  const ALLOWED_ROLES = ["Automation_QA_Engineer", "Manual_QA_Engineer", "QA_Leader", "Software_Engineer"];
  const roles = Array.from(new Set(results.flatMap((r: any) => parseJSON(r.target_role))))
    .filter(r => r && ALLOWED_ROLES.includes(r)) as string[];
    
  // 3. Tools: Chuẩn hóa tên công cụ
  const ALLOWED_TOOLS = ["Cypress", "Playwright", "Postman", "DevTools"];
  const rawTools = results.map((r: any) => r.tool_stack);
  const tools = Array.from(new Set(rawTools.map((t: string) => 
    ALLOWED_TOOLS.includes(t) ? t : "Generic"
  ))).filter(t => t !== null) as string[];

  return { categories, roles, tools };
}