import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
  params: Promise<{ role: string }>;
}

// ============================================================================
// 1. ÉP XUẤT TĨNH DANH SÁCH CÁC TRANG ROLES KHI BUILD (BẮT BUỘC CHO CLOUDFLARE)
// ============================================================================
export async function generateStaticParams() {
  const allPosts = getAllPosts();
  const rolesSet = new Set<string>();

  allPosts.forEach((post) => {
    const postRoles: string[] = Array.isArray((post as any).target_role)
      ? (post as any).target_role
      : [(post as any).target_role || ""];
    
    postRoles.forEach(role => {
      if (role) rolesSet.add(role.trim());
    });
  });

  // Trả về danh sách các slug role dạng tĩnh để Next.js tự build file HTML tương ứng
  return Array.from(rolesSet).map((role) => ({
    role: role, // Giữ nguyên chữ gốc (ví dụ: Manual_QA_Engineer)
  }));
}

// ============================================================================
// 2. TỐI ƯU SEO METADATA ĐỘNG CHO TỪNG TRANG DANH MỤC ROLE
// ============================================================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const cleanRole = resolvedParams.role.replace(/_/g, " ");

  return {
    title: `${cleanRole} Interview Guides & Solutions | QA Hacks`,
    description: `Master your next interview with exclusive situational questions, leadership challenges, and technical scenarios tailored for ${cleanRole} positions.`,
  };
}

// ============================================================================
// 3. COMPONENT HIỂN THỊ GIAO DIỆN CATEGORY CỦA ROLE
// ============================================================================
export default async function RoleCategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const currentRole = resolvedParams.role;
  const allPosts = getAllPosts();

  // Lọc bài viết thuộc về đúng Role hiện tại
  const filteredPosts = allPosts.filter((post) => {
    const postRoles: string[] = Array.isArray((post as any).target_role)
      ? (post as any).target_role
      : [(post as any).target_role || ""];
    return postRoles.includes(currentRole);
  });

  // Nếu gõ bừa một Role không tồn tại bài viết nào, quăng ra trang 404 sạch
  if (filteredPosts.length === 0) {
    notFound();
  }

  const cleanTitle = currentRole.replace(/_/g, " ");

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* BREADCRUMB THANH ĐIỀU HƯỚNG */}
        <nav className="flex items-center space-x-2 text-xs font-medium text-slate-400 mb-6">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Roles</span>
          <span className="text-slate-600">/</span>
          <span className="text-white font-semibold capitalize">{cleanTitle.toLowerCase()}</span>
        </nav>

        {/* TIÊU ĐỀ CHUYÊN MỤC CHỮ SẠCH */}
        <div className="border-b border-slate-900 pb-6 mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="inline-block w-2.5 h-6 bg-emerald-400 rounded-full"></span>
            {cleanTitle} Guides
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Collection of production-grade solutions and speaking blueprints for {cleanTitle} positions.
          </p>
        </div>

        {/* LƯỚI CARD BÀI VIẾT THUỘC CATEGORY */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => {
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

                    <div className="flex flex-wrap gap-1.5 mt-4">
  {postRoles.map((r: string) => (
    <span key={r} className="text-[10px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800/60 tracking-wide normal-case font-normal whitespace-nowrap">
      {r.replace(/_/g, " ")}
    </span>
  ))}
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

      </div>
    </main>
  );
}