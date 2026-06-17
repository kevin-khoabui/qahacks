"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface CategoryPaginationClientProps {
  posts: any[];
}

export default function CategoryPaginationClient({ posts }: CategoryPaginationClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // 💡 Bạn có thể chỉnh số này (ví dụ: 3, 6, 24) tùy theo số bài muốn hiện trên 1 trang
  const postsPerPage = 3; 

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const currentPosts = useMemo(() => {
    return posts.slice(indexOfFirstPost, indexOfLastPost);
  }, [posts, indexOfFirstPost, indexOfLastPost]);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  // ============================================================================
  // 🧠 THUẬT TOÁN CO GỌN SỐ TRANG (SLIDING WINDOW) - CHỐNG TRÀN UI
  // ============================================================================
  const pageNumbers = useMemo(() => {
    const delta = 1; // Số lượng trang hiển thị kề bên trang hiện tại
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
    const element = document.getElementById("category-hub-top");
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

  return (
    <>
      {/* DANH SÁCH BÀI VIẾT (GRID CARD) */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {currentPosts.map((post) => {
          const pTool = (post as any).tool_stack;
          return (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="group block p-6 bg-slate-900/40 rounded-2xl border border-slate-900/60 hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all duration-200"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider mb-3">
                    <span className="text-emerald-400 bg-emerald-950/40 border-emerald-900/30 px-2 py-0.5 rounded border">
                      {(post.sub_category || "General").replace(/_/g, " ")}
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
                </div>
                <div className="mt-5 flex items-center text-xs font-semibold text-slate-500 group-hover:text-emerald-400 transition-colors pt-2 border-t border-slate-900/40">
                  Practice Solution
                  <svg className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 🎯 THANH PHÂN TRANG THÔNG MINH - ĐÃ CO GỌN DẤU BA CHẤM */}
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-1.5 border-t border-slate-900 pt-8">
          
          {/* Nút Quay lại (Previous) */}
          <button
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 transition-colors ${
              currentPage === 1 
                ? "opacity-20 text-slate-600 cursor-not-allowed" 
                : "hover:text-emerald-400 cursor-pointer"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dải số đã bọc giáp thu gọn */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, index) => {
              // Nếu là dấu ba chấm "...", hiển thị text tĩnh không click được
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
                  className={`min-w-[36px] h-[36px] text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-slate-900/30 border-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Nút Kế tiếp (Next) */}
          <button
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 transition-colors ${
              currentPage === totalPages 
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
    </>
  );
}