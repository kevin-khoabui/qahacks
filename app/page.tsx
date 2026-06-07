import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default function HomePage() {
  // Lấy toàn bộ danh sách file bài viết .md từ thư mục content/posts
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Phần Tiêu đề Trang chủ (Header) */}
        <header className="border-b border-slate-800 pb-10 mb-12 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            QA<span className="text-emerald-400">Hacks</span>.com
          </h1>
          <p className="mt-3 text-lg text-slate-400 max-w-2xl">
            Master your Software Testing interviews with production-grade QA insights, automated scenarios, and expert solutions.
          </p>
        </header>

        {/* Khu vực danh sách các câu hỏi phỏng vấn */}
        <div>
          <h2 className="text-xl font-bold text-slate-300 mb-6 flex items-center gap-2">
            <span className="inline-block w-2 h-5 bg-emerald-400 rounded-full"></span>
            Latest Interview Questions ({posts.length})
          </h2>

          {/* Nếu chưa có bài viết nào */}
          {posts.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
              <p className="text-slate-500">No questions generated yet. Run your Gemini script to create content!</p>
            </div>
          ) : (
            // Lưới danh sách hiển thị các thẻ bài viết gọn gàng
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              {posts.map((post) => (
                <Link 
                  key={post.slug} 
                  href={`/posts/${post.slug}`}
                  className="group block p-6 bg-slate-900/60 rounded-2xl border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900 transition-all duration-200 shadow-sm"
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      {/* Thẻ phân loại nhỏ gọn phía trên */}
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider mb-3">
                        <span className="text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded-md border border-emerald-900/30">
                          {post.sub_category}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-md border ${
                          post.difficulty === "Advanced" 
                            ? "bg-amber-950/40 border-amber-900/30 text-amber-400" 
                            : "bg-sky-950/40 border-sky-900/30 text-sky-400"
                        }`}>
                          {post.difficulty}
                        </span>
                        {post.tool_stack !== "None" && (
                          <span className="text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/30">
                            {post.tool_stack}
                          </span>
                        )}
                      </div>

                      {/* Tiêu đề bài viết */}
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                    </div>

                    {/* Nút hành động giả định kín đáo ở góc đáy */}
                    <div className="mt-4 flex items-center text-xs font-medium text-slate-500 group-hover:text-emerald-400 transition-colors">
                      Read Solution 
                      <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}