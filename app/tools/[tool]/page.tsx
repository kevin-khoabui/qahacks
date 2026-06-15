import fs from "fs";
import path from "path";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/posts";

interface Props {
  params: Promise<{ tool: string }>;
}

// ============================================================================
// 1. GENERATE STATIC PARAMS
// ============================================================================
export async function generateStaticParams() {
  const jsonPath = path.resolve(process.cwd(), "public", "content", "posts.generated.json");
  const slugsSet = new Set<string>(["generic", "playwright", "cypress"]);

  try {
    let posts: any[] = [];
    if (fs.existsSync(jsonPath)) {
      const fileContents = fs.readFileSync(jsonPath, "utf8");
      posts = JSON.parse(fileContents);
    } else {
      posts = getAllPosts();
    }

    posts.forEach((post: any) => {
      const t = post.tool_stack;
      if (t && t !== "None") {
        slugsSet.add(String(t).toLowerCase().trim());
      }
    });
  } catch (error) {
    console.error("⚠️ Lỗi quét danh sách tool:", error);
  }

  return Array.from(slugsSet).map((slug) => ({
    tool: slug,
  }));
}

// ============================================================================
// 2. DYNAMIC METADATA GENERATOR
// ============================================================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const currentTool = resolvedParams.tool.toLowerCase();
  
  const displayTitle = currentTool === "generic" 
    ? "Generic" 
    : currentTool.charAt(0).toUpperCase() + currentTool.slice(1);

  return {
    title: `${displayTitle} Framework Guides | QAHacks`,
    description: `Master QA automation interview scenarios for ${displayTitle}.`,
  };
}

// ============================================================================
// 3. MAIN COMPONENT (BẢN SIÊU ỔN ĐỊNH - CHỐNG TRẮNG MÀN HÌNH)
// ============================================================================
export default async function ToolCategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const currentTool = resolvedParams.tool.toLowerCase().trim();

  const allPosts = getAllPosts();

  // Logic lọc bài viết tuyệt đối an toàn
  const filteredPosts = allPosts.filter((post: any) => {
    const rawTool = post.tool_stack || (post as any).tool || "None";
    const postToolLower = String(rawTool).toLowerCase().trim();

    if (currentTool === "generic") {
      return postToolLower === "none" || postToolLower === "generic" || postToolLower === "";
    }
    return postToolLower === currentTool;
  });

  if (filteredPosts.length === 0) {
    notFound();
  }

  // Định nghĩa tên hiển thị sạch, tránh dùng hàm biến đổi trực tiếp trong JSX
  let titleText = "Playwright";
  if (currentTool === "cypress") titleText = "Cypress";
  if (currentTool === "generic") titleText = "Generic Strategic";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* BREADCRUMB */}
        <nav className="flex items-center space-x-2 text-xs font-medium text-slate-500 mb-6+">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <span className="text-slate-700">/</span>
          <span className="text-slate-400">Tools</span>
          <span className="text-slate-700">/</span>
          <span className="text-slate-200 font-semibold">{titleText}</span>
        </nav>

        {/* TIÊU ĐỀ TRANG */}
        <div className="border-b border-slate-900 pb-6 mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span className="inline-block w-3 h-7 bg-emerald-500 rounded-full"></span>
            {titleText} Framework Guides
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {currentTool === "generic"
              ? "Comprehensive architecture breakdowns, manual workflows, database validations, and behavioral interview blueprints completely decoupled from specific tooling frameworks."
              : `Production-grade automation interview scenarios, continuous integration setups, design patterns, and advanced test script solutions.`}
          </p>
        </div>

        {/* LƯỚI BÀI VIẾT TĨNH */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post: any) => {
            const qType = post.question_type || "Question";
            const pTool = post.tool_stack || "None";
            const postRoles: string[] = Array.isArray(post.target_role)
              ? post.target_role
              : [post.target_role || "QA Engineer"];

            return (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="group block p-6 bg-slate-900/30 rounded-2xl border border-slate-900 hover:border-emerald-500/30 hover:bg-slate-900/60 transition-all duration-200 shadow-sm"
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-3.5">
                      <span className={`px-2 py-0.5 rounded border ${qType === "Compilation" ? "text-amber-400 bg-amber-950/30 border-amber-900/20" : "text-emerald-400 bg-emerald-950/30 border-emerald-900/20"}`}>
                        {qType === "Compilation" ? "MEGA COMPILATION" : (post.sub_category || "General").replace(/_/g, " ")}
                      </span>
                      <span className="bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-900">
                        {post.difficulty || "Advanced"}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-3 leading-snug">
                      {post.title}
                    </h2>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {postRoles.map((role: string) => {
                        if (!role) return null;
                        return (
                          <span 
                            key={role} 
                            className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-900 tracking-wide normal-case font-medium whitespace-nowrap inline-block"
                          >
                            {role.replace(/_/g, " ")}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center text-xs font-bold text-slate-500 group-hover:text-emerald-400 transition-colors pt-2 border-t border-slate-900/60">
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

      </div>
    </main>
  );
}