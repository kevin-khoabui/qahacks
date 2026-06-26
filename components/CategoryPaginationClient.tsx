"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface CategoryPaginationClientProps {
  posts: any[];
}

export default function CategoryPaginationClient({ posts }: CategoryPaginationClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 24; 

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = useMemo(() => posts.slice(indexOfFirstPost, indexOfLastPost), [posts, indexOfFirstPost, indexOfLastPost]);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    document.getElementById("category-hub-top")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* GRID LƯỚI 3 CỘT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPosts.map((post) => {
          const pTool = (post as any).tool_stack;
          return (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="flex flex-col p-6 bg-[#0B1121] rounded-2xl border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/50 transition-all duration-300 group"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 rounded border border-emerald-500/20">
                  {(post.sub_category || "General").replace(/_/g, " ")}
                </span>
                <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 rounded border border-slate-700">
                  {post.difficulty || "Advanced"}
                </span>
                {pTool && pTool !== "None" && pTool !== "Generic" && (
                  <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/40 rounded border border-sky-900/30">
                    {pTool}
                  </span>
                )}
              </div>
              <h2 className="text-sm font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors flex-grow leading-relaxed line-clamp-3">
                {post.title}
              </h2>
              <div className="mt-6 pt-4 border-t border-slate-800/50 text-[11px] font-bold tracking-widest uppercase text-slate-500 group-hover:text-emerald-500/70 transition-colors">
                Practice Solution →
              </div>
            </Link>
          );
        })}
      </div>

      {/* THANH PHÂN TRANG NGẮN GỌN */}
{totalPages > 1 && (
  <div className="mt-16 flex items-center justify-center gap-1.5 border-t border-slate-900 pt-8">
    
    {/* Nút lùi trang */}
    <button 
      onClick={() => handlePageChange(currentPage - 1)} 
      disabled={currentPage === 1} 
      className="p-2 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-emerald-400 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/>
      </svg>
    </button>
    
    <div className="flex items-center gap-1">
      {Array.from({ length: totalPages }, (_, i) => i + 1).filter(page => {
        return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
      }).map((page, index, array) => {
        const isEllipsis = index > 0 && page - array[index - 1] > 1;
        
        return (
          <div key={page} className="flex items-center gap-1">
            {isEllipsis && <span className="px-2 text-slate-600">...</span>}
            <button 
              onClick={() => handlePageChange(page)} 
              // Đã thêm cursor-pointer tại đây
              className={`min-w-[36px] h-[36px] text-xs font-bold rounded-xl border cursor-pointer ${currentPage === page ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-900/30 border-slate-900 text-slate-400 hover:text-slate-200"}`}
            >
              {page}
            </button>
          </div>
        );
      })}
    </div>

    {/* Nút tới trang */}
    <button 
      onClick={() => handlePageChange(currentPage + 1)} 
      disabled={currentPage === totalPages} 
      className="p-2 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-emerald-400 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
      </svg>
    </button>
  </div>
)}
    </>
  );
}