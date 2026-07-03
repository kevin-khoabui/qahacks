import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/posts";

function parseFirstCategory(value: string | null | undefined) {
  try {
    const arr = JSON.parse(value || "[]");
    return Array.isArray(arr) ? arr[0] || "General" : "General";
  } catch {
    return value || "General";
  }
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const db = await getDB();
  const keyword = `%${q}%`;

  const { results } = await db
    .prepare(`
      SELECT slug, title, category, tool_stack
      FROM posts
      WHERE title LIKE ?
         OR category LIKE ?
         OR target_role LIKE ?
         OR tool_stack LIKE ?
      ORDER BY date DESC
      LIMIT 10
    `)
    .bind(keyword, keyword, keyword, keyword)
    .all();

  const data = (results || []).map((post: any) => ({
    slug: post.slug,
    title: post.title,
    category: parseFirstCategory(post.category).replace(/_/g, " "),
    tool: post.tool_stack || "None",
  }));

  return NextResponse.json(data);
}