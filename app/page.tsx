import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import HeroBanner from "@/components/HeroBanner";
import { Metadata } from "next";

interface Props {
  searchParams: Promise<{ category?: string; sub?: string; type?: string; tool?: string; page?: string; q?: string }>;
}

const ITEMS_PER_PAGE = 12;

// ==========================================
// 1. DYNAMIC METADATA FOR HOMEPAGE & FILTERS
// ==========================================
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const filterCategory = params.category;
  const filterSub = params.sub;
  const filterType = params.type; 
  const filterTool = params.tool; 
  const searchQuery = params.q;

  let title = "QA Hacks | Enterprise QA Interview Preparation Hub";
  let description = "Master your next Software Testing interview with production-grade QA solutions, real-world microservices scenarios, and executive speaking blueprints.";

  // Điều chỉnh Meta theo hành vi bộ lọc của User hoặc Bot Google
  if (searchQuery) {
    title = `Search Results for "${searchQuery}" | QA Hacks`;
    description = `Browse the latest tech interview questions and professional answers containing the keyword "${searchQuery}".`;
  } else if (filterType === "Compilation") {
    title = "⭐ Mega Interview Compilations | QA Hacks";
    description = "Curated high-volume QA engineering preparation guides containing Top 10, 20, and 30 questions and expert solutions.";
  } else if (filterTool) {
    title = `${filterTool} Framework Interview Guides | QA Hacks`;
    description = `Production-ready automation testing interview challenges, advanced scripting scenarios, and verbal architectures tailored specifically for ${filterTool}.`;
  } else if (filterSub) {
    const cleanSub = filterSub.replace(/_/g, " ");
    title = `${cleanSub} Advanced Questions & Answers | QA Hacks`;
    description = `Deep-dive technical case studies, problem-solving breakdowns, and mock interview answers for ${cleanSub}.`;
  } else if (filterCategory) {
    const cleanCat = filterCategory.replace(/_/g, " ");
    title = `${cleanCat} Strategic QA Guides | QA Hacks`;
    description = `Comprehensive strategy roadmaps, behavioral scenarios, and architecture review responses for ${cleanCat} roles.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://qahacks.com",
      siteName: "QA Hacks Hub",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: "https://qahacks.com",
    },
  };
}

// ==========================================
// 2. MAIN HOMEPAGE COMPONENT
// ==========================================
export default async function HomePage({ searchParams }: Props) {
  const allPosts = getAllPosts();
  
  const params = await searchParams;
  const filterCategory = params.category;
  const filterSub = params.sub;
  const filterType = params.type; 
  const filterTool = params.tool; 
  const searchQuery = params.q?.toLowerCase(); 
  
  const currentPage = Number(params.page) || 1;

  // LỌC DỮ LIỆU CHÍNH (Giữ nguyên logic chính xác của bạn)
  const filteredPosts = allPosts.filter((post) => {
    const qType = (post as any).question_type;
    const postTool = (post as any).tool_stack;
    const postTitle = post.title?.toLowerCase() || "";
    const postRole = (post as any).target_role?.toLowerCase() || "";

    if (searchQuery) {
      const matchTitle = postTitle.includes(searchQuery);
      const matchTool = postTool?.toLowerCase().includes(searchQuery);
      const matchRole = postRole.includes(searchQuery);
      if (!matchTitle && !matchTool && !matchRole) return false;
    }

    if (filterType === "Compilation") return qType === "Compilation";
    if (filterTool) {
      if (qType === "Compilation") return false;
      return postTool === filterTool;
    }
    if (filterSub || filterCategory) {
      if (qType === "Compilation") return false; 
      if (filterCategory && post.category !== filterCategory) return false;
      if (filterSub && post.sub_category !== filterSub) return false;
      return true;
    }
    return true;
  });

  // PHÂN TRANG
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // TẠO TIÊU ĐỀ ĐỘNG TRÊN UI
  let pageTitle = "All Interview Guides";
  let pageDesc = "Deep-dive technical questions and production-grade solutions for QA Professionals.";

  if (searchQuery) {
    pageTitle = `Search results for "${params.q}"`;
    pageDesc = `Found ${filteredPosts.length} guides matching your keyword.`;
  } else if (filterType === "Compilation") {
    pageTitle = "⭐ Mega Interview Compilations";
    pageDesc = "Curated high-volume preparation guides containing Top 10, 20, 30 questions and answers.";
  } else if (filterTool) {
    pageTitle = `${filterTool} Framework Guides`; 
    pageDesc = `Production-grade interview questions and automation challenges specifically for ${filterTool}.`;
  } else if (filterSub) {
    pageTitle = `${filterSub.replace(/_/g, " ")} Questions`;
    pageDesc = `Deep-dive technical questions and production-grade solutions for ${filterSub.replace(/_/g, " ")}.`;
  } else if (filterCategory) {
    pageTitle = `${filterCategory.replace(/_/g, " ")} Guides`;
    pageDesc = `Comprehensive guides and technical scenarios for ${filterCategory.replace(/_/g, " ")}.`;
  }

  const isDefaultHome = !filterCategory && !filterSub && !filterType && !filterTool && !searchQuery && currentPage === 1;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      
      {/* HIỂN THỊ HERO BANNER NẾU LÀ TRANG CHỦ MẶC ĐỊNH */}
      {isDefaultHome && <HeroBanner />}

      {/* Cấu trúc Semantic HTML: Chuyển khối bọc danh sách sang thẻ <section> */}
      <section className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Phần header động */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="inline-block w-2.5 h-6 bg-emerald-400 rounded-full"></span>
              {pageTitle} <span className="text-slate-500 font-normal">({filteredPosts.length} total)</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {pageDesc}
            </p>
          </div>

          {(filterCategory || filterSub || filterType || filterTool || searchQuery) && (
            <Link href="/" className="text-xs text-emerald-400 hover:text-emerald-300 border border-slate-800 bg-slate-900/30 px-3 py-1.5 rounded-lg transition-colors">
              Clear Filter ✕
            </Link>
          )}
        </div>

        {/* LƯỚI HIỂN THỊ CÁC THẺ BÀI VIẾT */}
        {paginatedPosts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-900 rounded-2xl bg-slate-900/10">
            <p className="text-slate-500 text-sm">No items found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {paginatedPosts.map((post) => {
                const qType = (post as any).question_type;
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
                          <span className={`px-2 py-0.5 rounded border ${
                            qType === "Compilation" 
                              ? "text-amber-400 bg-amber-950/40 border-amber-900/30" 
                              : "text-emerald-400 bg-emerald-950/40 border-emerald-900/30"
                          }`}>
                            {qType === "Compilation" ? "MEGA COMPILATION" : (post.sub_category || "General")}
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

                        {/* Thẻ h2 cho tiêu đề bài viết lẻ ở trang danh sách để giữ đúng sơ đồ phân cấp HTML */}
                        <h2 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-3 leading-snug">
                          {post.title}
                        </h2>
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

            <Pagination totalPages={totalPages} currentPage={currentPage} />
          </>
        )}

      </section>
    </main>
  );
}