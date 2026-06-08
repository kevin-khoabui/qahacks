import { getPostData, getRelatedPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import Link from "next/link";
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

  // Lấy 2 bài viết liên quan (Cùng Category hoặc Tool)
  // Lưu ý: Bạn cần định nghĩa hàm getRelatedPosts trong lib/posts.ts
  const relatedPosts = await getRelatedPosts(resolvedParams.slug, post.category, 2);

  const isCompilation = post.question_type === "Compilation";
  const displayRole = post.target_role?.replace(/_/g, " ");

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative">

      {/* Nút Back về Dashboard tinh tế ở góc */}
      <div className="max-w-4xl mx-auto mb-6">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-teal-400 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-4xl mx-auto bg-[#0B1121] p-6 sm:p-12 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">

        {/* Hiệu ứng Glow nền phía sau Header cho bớt đơn điệu */}
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-teal-900/20 to-transparent pointer-events-none"></div>

        <div className="relative z-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 items-center text-xs font-semibold uppercase tracking-wider mb-6">
            <span className={`px-3 py-1.5 rounded-md border ${isCompilation
                ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                : "text-teal-400 bg-teal-500/10 border-teal-500/20"
              }`}>
              {isCompilation ? "⭐ MEGA COMPILATION" : `${post.category} / ${post.sub_category}`}
            </span>
            <span className={`px-3 py-1.5 rounded-md border ${post.difficulty === "Advanced" ? "text-rose-400 bg-rose-500/10 border-rose-500/20" : "text-sky-400 bg-sky-500/10 border-sky-500/20"
              }`}>
              {post.difficulty}
            </span>
            {post.tool_stack !== "None" && (
              <span className="text-slate-300 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700">
                {post.tool_stack}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="border-b border-slate-800 mb-10 pb-6 flex justify-between items-center text-sm text-slate-400">
            <p className="flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Target Role: <span className="text-slate-200 font-medium">{displayRole}</span>
            </p>
          </div>

          {/* NỘI DUNG MARKDOWN */}
          <article className="prose prose-slate prose-invert max-w-none prose-headings:text-slate-100 prose-a:text-teal-400 hover:prose-a:text-teal-300 prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-slate-800">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {post.content}
            </ReactMarkdown>
          </article>
        </div>

        {/* ------------------------------------------------ */}
        {/* KHU VỰC "UP NEXT" ĐỂ GIỮ CHÂN USER (RELATED POSTS) */}
        {/* ------------------------------------------------ */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="bg-teal-500/20 text-teal-400 p-1.5 rounded-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                Up Next: Related Challenges
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((rp) => (
                <Link
                  href={`/posts/${rp.slug}`} // Đường dẫn đúng chuẩn của bạn
                  key={rp.slug}
                  className="group block p-5 rounded-xl border border-slate-800 bg-[#111827] hover:bg-slate-800/50 hover:border-teal-500/40 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                    <span className="text-sky-400">{rp.difficulty}</span>
                    <span>•</span>
                    <span>{rp.tool_stack !== 'None' ? rp.tool_stack : rp.category}</span>
                  </div>
                  <h4 className="text-base font-semibold text-slate-200 group-hover:text-teal-300 line-clamp-2 leading-snug">
                    {rp.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}