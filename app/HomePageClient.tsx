"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import { fetchAllPostsAction } from "@/lib/actions";

interface Post {
  slug: string; title: string; difficulty: string; target_role: string[];
  category: string[]; sub_category: string; question_type: string;
  tool_stack: string; date?: string;
}

export default function HomePageClient() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const postsListRef = useRef<HTMLDivElement>(null);
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterTool, setFilterTool] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 24;

  useEffect(() => {
    async function fetchData() {
      const posts = await fetchAllPostsAction();
      setAllPosts(posts as Post[]);
      setLoading(false);
    }
    fetchData();
  }, []);

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

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      if (filterRole && !post.target_role.includes(filterRole)) return false;
      if (filterCategory && !post.category.includes(filterCategory)) return false;
      if (filterTool && post.tool_stack !== filterTool) return false;
      if (filterType && post.question_type !== filterType) return false;
      return true;
    });
  }, [allPosts, filterRole, filterCategory, filterTool, filterType]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (postsListRef.current) {
      const elementPosition = postsListRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 100;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400">Loading article...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <HeroBanner />
        
        <div ref={postsListRef} className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedPosts.map((post) => (
            <Link 
              href={`/posts/${post.slug}`} 
              key={post.slug}
              className="p-6 bg-[#0B1121] rounded-xl border border-slate-800 hover:border-emerald-500 transition-all"
            >
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <div className="text-sm text-slate-400">
                <span>{post.difficulty}</span> • <span>{post.tool_stack}</span>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-1.5 border-t border-slate-900 pt-8">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-emerald-400 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isVisible = page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                if (!isVisible) {
                  if (page === 2 || page === totalPages - 1) return <span key={page} className="px-2 text-slate-600">...</span>;
                  return null;
                }
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`min-w-9 h-9 text-xs font-bold rounded-xl border cursor-pointer ${
                      currentPage === page 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                        : "bg-slate-900/30 border-slate-900 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-emerald-400 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}