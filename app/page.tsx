"use client";

import { useState, useMemo, useEffect } from "react";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import { SITE_CONFIG } from "@/lib/config";

export default function HomePage() {
  const allPosts = getAllPosts();

  // 🎯 1. QUẢN LÝ BỘ LỌC QUA STATE (HỖ TRỢ LỌC ĐỘNG TẠI TRANG CHỦ)
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterTool, setFilterTool] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  // 🎯 2. QUẢN LÝ PHÂN TRANG (24 BÀI / TRANG)
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 24;

  // Lắng nghe URL Query Parameters để đồng bộ bộ lọc
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setFilterRole(params.get("role"));
      setFilterCategory(params.get("category"));
      setFilterTool(params.get("tool"));
      setFilterType(params.get("type"));
      setCurrentPage(1);
    }
  }, []);

  const clearFilters = () => {
    setFilterRole(null);
    setFilterCategory(null);
    setFilterTool(null);
    setFilterType(null);
    setCurrentPage(1);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/");
    }
  };

  // ============================================================================
  // 🔍 BỘ LỌC MA TRẬN KHÔNG SỢ LỆCH CHỮ HOA/THƯỜNG VÀ DẤU GẠCH DƯỚI
  // ============================================================================
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const postRoles: string[] = (
        Array.isArray((post as any).target_role)
          ? (post as any).target_role
          : [(post as any).target_role || ""]
      ).map((r: string) => r.toLowerCase().replace(/[^a-z0-9]/g, ""));

      const postCategories: string[] = (
        Array.isArray(post.category)
          ? post.category
          : [post.category || ""]
      ).map((c: string) => c.toLowerCase().replace(/[^a-z0-9]/g, ""));

      const postTool = ((post as any).tool_stack || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const postType = ((post as any).question_type || "").toLowerCase().replace(/[^a-z0-9]/g, "");

      if (filterRole && !postRoles.includes(filterRole.toLowerCase().replace(/[^a-z0-9]/g, ""))) return false;
      if (filterCategory && !postCategories.includes(filterCategory.toLowerCase().replace(/[^a-z0-9]/g, ""))) return false;
      if (filterType && postType !== filterType.toLowerCase().replace(/[^a-z0-9]/g, "")) return false;

      if (filterTool) {
        const cleanToolFilter = filterTool.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (cleanToolFilter === "generic" && (postTool === "none" || postTool === "")) {
          return true;
        }
        if (postTool !== cleanToolFilter) return false;
      }

      return true;
    });
  }, [allPosts, filterRole, filterCategory, filterTool, filterType]);

  // ============================================================================
  // 📐 LOGIC ĐO ĐẠC VÀ HÀM CUỘN TỌA ĐỘ OFFSET CHUẨN XÁC
  // ============================================================================
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const currentPosts = useMemo(() => {
    return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  }, [filteredPosts, indexOfFirstPost, indexOfLastPost]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // ============================================================================
  // 🧠 THUẬT TOÁN CO GỌN SỐ TRANG (SLIDING WINDOW) - CHỐNG TRÀN UI TRANG CHỦ
  // ============================================================================
  const pageNumbers = useMemo(() => {
    const delta = 1; // Số lượng số hiển thị kề hai bên trang hiện tại
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let prevPage: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (prevPage !== undefined) {
        if (i - prevPage === 2) {
          rangeWithDots.push(prevPage + 1);
        } else if (i - prevPage > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      prevPage = i;
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);

    // Tìm phần tử tiêu đề của danh sách bài viết
    const element = document.getElementById("main-hub");
    if (element) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Tính toán tiêu đề động tinh gọn cho UI
  const activeFilterValue = filterRole || filterCategory || filterTool || filterType;
  const isDefaultHome = !activeFilterValue;

  let pageTitle = "All Interview Guides";
  let pageDesc = "Deep-dive technical questions and production-grade solutions for QA Professionals.";

  if (activeFilterValue) {
    pageTitle = `${activeFilterValue.replace(/_/g, " ")} Filtered Hub`;
    pageDesc = `Showing validated software testing blueprints targeted for ${activeFilterValue.replace(/_/g, " ")}.`;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 scroll-mt-20">
      <HeroBanner />

      <section id="main-hub" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
              <span className="inline-block w-2 h-5 bg-emerald-400 rounded-sm"></span>
              {pageTitle} <span className="text-slate-500 font-normal">({filteredPosts.length})</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">{pageDesc}</p>
          </div>

          {!isDefaultHome && (
            <button
              onClick={clearFilters}
              className="text-xs text-emerald-400 hover:text-emerald-300 border border-slate-800 bg-slate-900/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-semibold"
            >
              Clear Filter ✕
            </button>
          )}
        </div>

        {/* Lưới Render Bài viết (Giới hạn tối đa 24 bài) */}
        {currentPosts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-900 rounded-2xl bg-slate-900/10">
            <p className="text-slate-500 text-sm">No items found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {currentPosts.map((post) => {
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

                      <div className="flex flex-wrap gap-1 mt-4" onClick={(e) => e.preventDefault()}>
                        {postRoles.map((role: string) => {
                          if (!role) return null;
                          return (
                            <span key={role} className="text-[9px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800/40 tracking-wide">
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

        {/* ==========================================
            🚀 PREMIUM EBOOK INLINE BANNER
            ========================================== */}
        <div className="mt-16 p-6 rounded-2xl border border-amber-500/10 bg-gradient-to-br from-slate-950 via-[#0E1626] to-slate-950 text-center relative overflow-hidden">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-24 bg-amber-500/5 blur-[60px] rounded-full pointer-events-none"></div>

          <span className="inline-block text-[9px] font-extrabold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-md uppercase tracking-wider mb-3 border border-amber-500/20">
            Premium Resource
          </span>

          <h3 className="text-base font-bold text-white mb-1.5 tracking-tight">
            Level up your management mindset and crush your next QA Lead interview
          </h3>

          <p className="text-xs text-slate-400 max-w-xl mx-auto mb-4 leading-relaxed">
            Get exclusive access to the comprehensive <strong>QA Lead Interview Master Pack</strong> from QAHacks. A curated collection of 50 deep, real-world scenarios covering quality governance, conflict resolution, and process optimization.
          </p>

          <a
            href={SITE_CONFIG.links.gumroadProduct}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-500/5 cursor-pointer"
          >
            Buy & Download PDF Now
          </a>
        </div>

        {/* ==========================================
            🎯 COMPONENT ĐIỀU HƯỚNG PHÂN TRANG THÔNG MINH (SLIDING WINDOW)
            ========================================== */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-1.5 border-t border-slate-900 pt-8">

            {/* NÚT PREV (LÙI TRANG) */}
            <button
              onClick={() => {
                if (currentPage === 1) return;
                handlePageChange(currentPage - 1);
              }}
              disabled={currentPage === 1}
              className={`p-2 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 transition-colors ${currentPage === 1
                  ? "opacity-20 text-slate-600 cursor-not-allowed"
                  : "hover:text-emerald-400 cursor-pointer"
                }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* DANH SÁCH CÁC SỐ TRANG ĐÃ ĐƯỢC THU GỌN CHỐNG TRÀN */}
            <div className="flex items-center gap-1">
              {pageNumbers.map((page, index) => {
                // Nếu là dấu ba chấm "...", render thẻ span tĩnh rỗng
                if (page === "...") {
                  return (
                    <span
                      key={`dots-${index}`}
                      className="min-w-[36px] h-[36px] flex items-center justify-center text-xs font-bold text-slate-600 select-none"
                    >
                      ...
                    </span>
                  );
                }

                const isActive = page === currentPage;
                return (
                  <button
                    key={`page-${page}`}
                    onClick={() => handlePageChange(page as number)}
                    className={`min-w-[36px] h-[36px] text-xs font-bold rounded-xl border transition-all cursor-pointer ${isActive
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-slate-900/30 border-slate-900 text-slate-400 hover:text-slate-200"
                      }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* NÚT NEXT (TIẾN TRANG) */}
            <button
              onClick={() => {
                if (currentPage === totalPages) return;
                handlePageChange(currentPage + 1);
              }}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 transition-colors ${currentPage === totalPages
                  ? "opacity-20 text-slate-600 cursor-not-allowed"
                  : "hover:text-emerald-400 cursor-pointer"
                }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

      </section>
    </main>
  );
}