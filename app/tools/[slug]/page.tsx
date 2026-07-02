import { getCloudflareContext } from "@opennextjs/cloudflare";
import { notFound } from "next/navigation";
import CategoryPaginationClient from "../../../components/CategoryPaginationClient";

export const runtime = 'edge';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug); 
  const formattedTool = decodedSlug.replace(/_/g, " ");

  const db = (getCloudflareContext().env as any).DB;
  const { results } = await db.prepare(
    "SELECT * FROM posts WHERE LOWER(tool_stack) = LOWER(?)"
  )
  .bind(decodedSlug)
  .all();

  if (!results || results.length === 0) {
    notFound(); 
  }

  const posts = results.map((post: any) => ({
    ...post,
    category: JSON.parse(post.category || '[]'),
  }));

  return (
    <main className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div id="category-hub-top" className="mb-12">
          
          {/* Tiêu đề */}
          <h1 className="text-3xl font-black text-white capitalize tracking-tight">
            {formattedTool} 
            <span className="text-slate-600 font-normal ml-3">({posts.length} items)</span>
          </h1>
          
          {/* Câu mô tả (Đã thêm class w-full để tràn viền) */}
          <p className="mt-4 text-slate-400 w-full">
            Explore curated interview content specifically for <strong>{formattedTool}</strong>. 
            Master the technical challenges, automation frameworks, and engineering standards required.
          </p>

        </div>
        
        {/* Nhúng component vào đây */}
        <CategoryPaginationClient posts={posts} />
      </div>
    </main>
  );
}