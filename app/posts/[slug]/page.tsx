import { getPostData } from "@/lib/posts";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
// Nạp theme màu sắc hiển thị code chuẩn Github Dark
import "highlight.js/styles/github-dark.css"; 

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = await getPostData(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    // Bọc toàn bộ trang bằng nền tối tối ưu cho mắt lập trình viên
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-slate-900/50 p-6 sm:p-10 rounded-2xl border border-slate-800 shadow-2xl">
        
        {/* Phần hiển thị các thẻ phân loại dữ liệu */}
        <div className="flex flex-wrap gap-2 items-center text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-4">
          <span className="bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/60">
            {post.category} / {post.sub_category}
          </span>
          <span className={`px-3 py-1 rounded-full border ${
            post.difficulty === "Advanced" ? "bg-amber-950/80 border-amber-800/60 text-amber-400" : "bg-sky-950/80 border-sky-800/60 text-sky-400"
          }`}>
            {post.difficulty}
          </span>
          {post.tool_stack !== "None" && (
            <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
              Tool: {post.tool_stack}
            </span>
          )}
        </div>

        {/* Tiêu đề bài viết chuẩn SEO */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
          {post.title}
        </h1>

        <div className="border-b border-slate-800 mb-8 pb-4">
          <p className="text-sm text-slate-400">Target Role: <span className="text-slate-200 font-medium">{post.target_role}</span></p>
        </div>

        {/* THẦN CHÚ: Sử dụng duy nhất cụm class chuẩn để kích hoạt tự động làm đẹp văn bản và code block */}
        <article className="prose prose-slate prose-invert max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeHighlight]}
          >
            {post.content}
          </ReactMarkdown>
        </article>

      </div>
    </main>
  );
}