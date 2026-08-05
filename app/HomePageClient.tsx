"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
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
  quality_score?: number;
  date?: string;
}

const ROLE_LABELS: Record<string, string> = {
  Automation_QA_Engineer: "Automation QA",
  Manual_QA_Engineer: "Manual QA",
  QA_Leader: "QA Leadership",
  Software_Engineer: "SDET / Engineering",
};

export default function HomePageClient() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const postsListRef = useRef<HTMLDivElement>(null);

  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterTool, setFilterTool] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 18;

  useEffect(() => {
    fetchAllPostsAction()
      .then((posts) => setAllPosts(posts as Post[]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilterRole(params.get("role"));
    setFilterCategory(params.get("category"));
    setFilterTool(params.get("tool"));
    setFilterType(params.get("type"));
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

  const featuredPosts = filteredPosts.slice(0, 6);
  const remainingPosts = filteredPosts.slice(6);
  const totalPages = Math.max(1, Math.ceil(remainingPosts.length / postsPerPage));
  const paginatedPosts = remainingPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    postsListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-emerald-400">
        Loading curated interview library…
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <HeroBanner />

        <section className="mt-14">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                Curated first
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Featured interview questions
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Start with practical questions selected for interview relevance, depth, and real-world usefulness.
              </p>
            </div>
            <p className="text-sm text-slate-500">{filteredPosts.length} published questions</p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post, index) => (
              <Link
                href={`/posts/${post.slug}`}
                key={post.slug}
                className="group rounded-2xl border border-emerald-500/15 bg-linear-to-b from-slate-900 to-[#0B1121] p-6 shadow-lg transition hover:-translate-y-1 hover:border-emerald-400/50"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                    Featured {index + 1}
                  </span>
                  <span className="text-xs text-slate-500">{post.difficulty}</span>
                </div>
                <h3 className="text-xl font-bold leading-snug text-white group-hover:text-emerald-300">
                  {post.title}
                </h3>
                <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-400">
                  <span>{post.tool_stack || "General QA"}</span>
                  {post.target_role[0] && <span>• {ROLE_LABELS[post.target_role[0]] || post.target_role[0]}</span>}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section ref={postsListRef} className="mt-16 scroll-mt-24">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Library</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white">Explore more questions</h2>
          </div>

          {paginatedPosts.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center text-slate-400">
              No additional questions match this filter yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedPosts.map((post) => (
                <Link
                  href={`/posts/${post.slug}`}
                  key={post.slug}
                  className="group rounded-2xl border border-slate-800 bg-[#0B1121] p-6 transition hover:border-emerald-500/50"
                >
                  <h3 className="text-lg font-bold leading-snug text-slate-100 group-hover:text-emerald-300">
                    {post.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span>{post.difficulty}</span>
                    <span>•</span>
                    <span>{post.tool_stack || "General QA"}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-3 border-t border-slate-900 pt-8">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-xl border border-slate-800 px-4 py-2 text-sm text-slate-400 disabled:opacity-30"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="rounded-xl border border-slate-800 px-4 py-2 text-sm text-slate-400 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
