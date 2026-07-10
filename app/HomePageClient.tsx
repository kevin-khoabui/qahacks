"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import FeaturedCollections from "@/components/FeaturedCollections";
import { fetchAllPostsAction } from "@/lib/actions";

interface Post {
  slug: string;
  title: string;
  difficulty: string;
  target_role: string[];
  category: string[];
  sub_category: string;
  question_type: string;
  tool_stack: string;
  date?: string;
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
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-emerald-400">
        Loading article...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <HeroBanner />

        <FeaturedCollections />

        <section ref={postsListRef} className="mt-14">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Latest
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                Latest Interview Questions
              </h2>
            </div>

            <p className="text-sm text-slate-500">
              {filteredPosts.length} question{filteredPosts.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map((post) => (
              <Link
                href={`/posts/${post.slug}`}
                key={post.slug}
                className="rounded-xl border border-slate-800 bg-[#0B1121] p-6 transition-all hover:border-emerald-500"
              >
                <h3 className="mb-2 text-xl font-bold">{post.title}</h3>

                <div className="text-sm text-slate-400">
                  <span>{post.difficulty}</span>
                  <span> • </span>
                  <span>{post.tool_stack || "General"}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-1.5 border-t border-slate-900 pt-8">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900/50 p-2 text-slate-400 transition-all hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-20"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isVisible =
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1);

                if (!isVisible) {
                  if (page === 2 || page === totalPages - 1) {
                    return (
                      <span key={page} className="px-2 text-slate-600">
                        ...
                      </span>
                    );
                  }

                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`h-9 min-w-9 cursor-pointer rounded-xl border text-xs font-bold ${
                      currentPage === page
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-slate-900 bg-slate-900/30 text-slate-400 hover:text-slate-200"
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
              className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900/50 p-2 text-slate-400 transition-all hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-20"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}