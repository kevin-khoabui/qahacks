"use client";

import { useEffect, useState } from "react";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";

export default function HomePage() {
  const allPosts = getAllPosts();

  // 9 Trạng thái quản lý bộ lọc tương ứng với 9 thuộc tính frontmatter dữ liệu
  const [filterTargetRole, setFilterTargetRole] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterSubCategory, setFilterSubCategory] = useState<string | null>(null);
  const [filterQuestionType, setFilterQuestionType] = useState<string | null>(null);
  const [filterCoreTestingType, setFilterCoreTestingType] = useState<string | null>(null);
  const [filterDomain, setFilterDomain] = useState<string | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string | null>(null);
  const [filterToolStack, setFilterToolStack] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);

  // ============================================================================
  // ⚡ BỘ PHÂN TÍCH HASH URL 9 TẦNG (MATRIX URL PARSER - ANTI BUG VERSION)
  // ============================================================================
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      
      // Reset sạch sẽ toàn bộ tiêu chí lọc trước khi nạp lượt quét mới
      setFilterTargetRole(null);
      setFilterCategory(null);
      setFilterSubCategory(null);
      setFilterQuestionType(null);
      setFilterCoreTestingType(null);
      setFilterDomain(null);
      setFilterPlatform(null);
      setFilterToolStack(null);
      setFilterDifficulty(null);

      if (!hash || hash === "#") return;

      // 🚀 VÁ LỖI CHÍ MẠNG: Gọt sạch dấu # thừa, ép về chuỗi param chuẩn cấu trúc &
      const cleanHash = hash.startsWith("#") ? hash.substring(1) : hash;
      const normalizedHash = cleanHash.replace(/#/g, "&"); 

      const params = new URLSearchParams(normalizedHash);

      if (params.get("target_role")) setFilterTargetRole(params.get("target_role"));
      if (params.get("category")) setFilterCategory(params.get("category"));
      if (params.get("sub_category")) setFilterSubCategory(params.get("sub_category"));
      if (params.get("question_type")) setFilterQuestionType(params.get("question_type"));
      if (params.get("core_testing_type")) setFilterCoreTestingType(params.get("core_testing_type"));
      if (params.get("domain")) setFilterDomain(params.get("domain"));
      if (params.get("platform")) setFilterPlatform(params.get("platform"));
      if (params.get("tool_stack")) setFilterToolStack(params.get("tool_stack"));
      if (params.get("difficulty")) setFilterDifficulty(params.get("difficulty"));

      // Đẩy góc nhìn lên đỉnh đầu trang chuẩn chỉ không lệch pha UI
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    const interval = setInterval(handleHashChange, 200);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      clearInterval(interval);
    };
  }, []);

  const clearFilters = () => {
    window.location.hash = "";
  };

  // ============================================================================
  // 🔍 HÀM LỌC MA TRẬN DỮ LIỆU CHỮ THƯỜNG KHÔNG SỢ LỆCH DẤU GẠCH DƯỚI
  // ============================================================================
  const filteredPosts = allPosts.filter((post) => {
    // Trích xuất an toàn và chuẩn hóa toàn bộ các mảng/chuỗi từ file .md
    const postRoles: string[] = Array.isArray((post as any).target_role) ? (post as any).target_role : [(post as any).target_role || ""];
    const postCategories: string[] = Array.isArray(post.category) ? post.category : [post.category || ""];
    
    const postSub = ((post as any).sub_category || "").toLowerCase();
    const postQType = ((post as any).question_type || "").toLowerCase();
    const postCoreType = ((post as any).core_testing_type || "").toLowerCase();
    const postDomain = ((post as any).domain || "").toLowerCase();
    const postPlatform = ((post as any).platform || "").toLowerCase();
    const postTool = ((post as any).tool_stack || "").toLowerCase();
    const postDiff = (post.difficulty || "").toLowerCase();

    // 1. Kiểm tra Target Role
    if (filterTargetRole && !postRoles.some(r => r.toLowerCase().includes(filterTargetRole.toLowerCase()))) return false;
    
    // 2. Kiểm tra Category
    if (filterCategory && !postCategories.some(c => c.toLowerCase().includes(filterCategory.toLowerCase()))) return false;
    
    // 3. Kiểm tra Sub Category
    if (filterSubCategory && !postSub.includes(filterSubCategory.toLowerCase())) return false;
    
    // 4. Kiểm tra Question Type
    if (filterQuestionType && !postQType.includes(filterQuestionType.toLowerCase())) return false;
    
    // 5. Kiểm tra Core Testing Type
    if (filterCoreTestingType && !postCoreType.includes(filterCoreTestingType.toLowerCase())) return false;
    
    // 6. Kiểm tra Domain
    if (filterDomain && !postDomain.includes(filterDomain.toLowerCase())) return false;
    
    // 7. Kiểm tra Platform
    if (filterPlatform && !postPlatform.includes(filterPlatform.toLowerCase())) return false;
    
// 8. Kiểm tra Tool Stack - ĐÃ ĐỒNG BỘ THÔNG MINH GIỮA GENERIC VÀ NONE
if (filterToolStack) {
  const cleanFilter = filterToolStack.toLowerCase();
  
  if (cleanFilter === "generic") {
    // Nếu URL là Generic, bốc những bài có tool_stack là none
    if (postTool !== "none") return false;
  } else {
    // Các trường hợp tool khác (playwright, cypress...) giữ nguyên logic
    if (!postTool.includes(cleanFilter)) return false;
  }
}
    
    // 9. Kiểm tra Difficulty
    if (filterDifficulty && !postDiff.includes(filterDifficulty.toLowerCase())) return false;

    return true;
  });

  // ============================================================================
  // 📍 TÍNH TOÁN TIÊU ĐỀ DỘNG CHO UI (CLEAN TITLE DISPATCHER)
  // ============================================================================
  let activeFilterValue = filterTargetRole || filterCategory || filterSubCategory || filterQuestionType || filterCoreTestingType || filterDomain || filterPlatform || filterToolStack || filterDifficulty;
  
  let pageTitle = "All Interview Guides";
  let pageDesc = "Deep-dive technical questions and production-grade solutions for QA Professionals.";

  if (activeFilterValue) {
    const cleanActiveName = activeFilterValue.replace(/_/g, " ");
    pageTitle = `${cleanActiveName} Filtered Guides`;
    pageDesc = `Showing validated software testing blueprints targeted specifically for ${cleanActiveName}.`;
  }

  const isDefaultHome = !activeFilterValue;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 scroll-mt-20">
      {/* {isDefaultHome && <HeroBanner />} */}

<section 
  id="main-hub" 
  className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-10 ${
    isDefaultHome ? "py-12" : "pt-4 pb-12"
  }`}
>        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="inline-block w-2.5 h-6 bg-emerald-400 rounded-full"></span>
              {pageTitle}
            </h1>
            <p className="text-xs text-slate-400 mt-1">{pageDesc}</p>
          </div>

          {!isDefaultHome && (
            <button 
              onClick={clearFilters}
              className="text-xs text-emerald-400 hover:text-emerald-300 border border-slate-800 bg-slate-900/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer select-none font-semibold"
            >
              Clear Filter ✕
            </button>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-900 rounded-2xl bg-slate-900/10">
            <p className="text-slate-500 text-sm">No items found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => {
              const qType = (post as any).question_type;
              const pTool = (post as any).tool_stack;
              const postRoles: string[] = Array.isArray((post as any).target_role) ? (post as any).target_role : [(post as any).target_role || ""];

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

                      <div className="flex flex-wrap gap-1.5 mt-4" onClick={(e) => e.preventDefault()}>
                        {postRoles.map((role: string) => {
                          if (!role) return null;
                          return (
                            <span key={role} className="text-[10px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800/60 tracking-wide normal-case font-normal whitespace-nowrap">
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
        )}
      </section>
    </main>
  );
}