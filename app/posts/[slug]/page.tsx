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

  // Kiểm tra xem bài viết này có phải là Bộ đề tổng hợp (Top 10, 20...) hay không
  const isCompilation = post.question_type === "Compilation";

  return (
    // Bọc toàn bộ trang bằng nền tối tối ưu cho mắt lập trình viên
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-slate-900/50 p-6 sm:p-10 rounded-2xl border border-slate-800 shadow-2xl">
        
        {/* Phần hiển thị các thẻ phân loại dữ liệu */}
        <div className="flex flex-wrap gap-2 items-center text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-4">
          <span className={`px-3 py-1 rounded-full border ${
            isCompilation 
              ? "text-amber-400 bg-amber-950/80 border-amber-800/60" 
              : "text-emerald-400 bg-emerald-950/80 border-emerald-800/60"
          }`}>
            {isCompilation ? "⭐ MEGA COMPILATION" : `${post.category} / ${post.sub_category}`}
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

        <div className="border-b border-slate-800 mb-8 pb-4 flex justify-between items-center text-sm text-slate-400">
          <p>Target Role: <span className="text-slate-200 font-medium">{post.target_role?.replace(/_/g, " ")}</span></p>
          {isCompilation && <span className="text-xs text-amber-400 font-mono bg-amber-950/30 px-2 py-0.5 rounded border border-amber-900/30">All-in-one Guide</span>}
        </div>

        {/* HIỂN THỊ NỘI DUNG MỘT CÁCH CHUYÊN NGHIỆP */}
        <article className="prose prose-slate prose-invert max-w-none">
          {isCompilation ? (
            // Layout nâng cấp dành riêng cho bài viết Top bộ đề
            <div className="space-y-4 dynamic-compilation">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeHighlight]}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          ) : (
            // Layout chuẩn gốc dành cho bài viết một câu hỏi đơn lẻ
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeHighlight]}
            >
              {post.content}
            </ReactMarkdown>
          )}
        </article>

      </div>
    </main>
  );
}