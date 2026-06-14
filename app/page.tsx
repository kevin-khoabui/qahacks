import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import { Metadata } from "next";

export const dynamic = "force-static";

// 1. Chỉ định Metadata cố định cho trang chủ mặt tiền (Không dùng searchParams động ở Server)
export const metadata: Metadata = {
  title: "QA Hacks | Enterprise QA Interview Preparation Hub",
  description: "Master your next Software Testing interview with production-grade QA solutions, real-world microservices scenarios, and executive speaking blueprints.",
  openGraph: {
    title: "QA Hacks | Enterprise QA Interview Preparation Hub",
    description: "Master your next Software Testing interview with production-grade QA solutions, real-world microservices scenarios, and executive speaking blueprints.",
    url: "https://qahacks.com",
    siteName: "QA Hacks Hub",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QA Hacks | Enterprise QA Interview Preparation Hub",
    description: "Master your next Software Testing interview with production-grade QA solutions, real-world microservices scenarios, and executive speaking blueprints.",
  },
  alternates: {
    canonical: "https://qahacks.com",
  },
};

export default function HomePage() {
  // Lấy toàn bộ bài viết thô từ file JSON/Markdown
  const allPosts = getAllPosts();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hiện Banner mặt tiền */}
      <HeroBanner />

      <section className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="inline-block w-2.5 h-6 bg-emerald-400 rounded-full"></span>
              All Interview Guides
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Deep-dive technical questions and production-grade solutions for QA Professionals.
            </p>
          </div>
        </div>

        {/* Lưới hiển thị 24 bài viết sạch nguyên bản, đảm bảo luôn đẻ ra index.html */}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((post) => {
            const qType = (post as any).question_type;
            const pTool = (post as any).tool_stack;
            const postRoles: string[] = Array.isArray((post as any).target_role)
              ? (post as any).target_role
              : [(post as any).target_role || ""];

            return (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="group block p-6 bg-slate-900/40 rounded-2xl border border-slate-900/60 hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all duration-200"
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider mb-3">
                      <span className={`px-2 py-0.5 rounded border ${qType === "Compilation" ? "text-amber-400 bg-amber-950/40 border-amber-900/30" : "text-emerald-400 bg-emerald-950/40 border-emerald-900/30"}`}>
                        {qType === "Compilation" ? "MEGA COMPILATION" : (post.sub_category || "General").replace(/_/g, " ")}
                      </span>
                      <span className="bg-slate-900/50 text-slate-400 px-2 py-0.5 rounded border border-slate-800/30">
                        {post.difficulty}
                      </span>
                      {pTool && pTool !== "None" && (
                        <span className="bg-sky-950/40 text-sky-400 px-2 py-0.5 rounded border border-sky-900/30">
                          {pTool}
                        </span>
                      )}
                    </div>

                    <h2 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-3 leading-snug">
                      {post.title}
                    </h2>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {postRoles.map((role: string) => {
                        if (!role) return null;
                        return (
                          <span key={role} className="text-[10px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800/60 tracking-wide normal-case font-normal">
                            {role.replace(/_/g, " ")}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center text-xs font-semibold text-slate-500 group-hover:text-emerald-400 transition-colors pt-2 border-t border-slate-900/40">
                    {qType === "Compilation" ? "Open Full Compilation" : "Practice Solution"}
                    <svg className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}