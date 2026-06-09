import { getPostData, getRelatedPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import { Metadata } from "next";
import "highlight.js/styles/github-dark.css";
import TableOfContents from "@/components/TableOfContents";

interface Props {
  params: Promise<{ slug: string }>;
}

// ============================================================================
// 1. GENERATE DYNAMIC METADATA (SEO PRO-GRADE)
// ============================================================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostData(resolvedParams.slug);

  if (!post) {
    return {
      title: "Article Not Found | QA Hacks",
      description: "The requested QA automation tutorial or interview guide does not exist or has been moved.",
    };
  }

  // Tự động bóc tách text sạch từ Markdown content để làm Description nếu cần thiết
  // Tuy nhiên cấu trúc speaking blueprint của bạn hiện tại đã rất tối ưu
  const cleanTitle = `${post.title} | QA Hacks`;
  const cleanDescription = `Master the QA Interview: ${post.title}. Professional solution and speaking blueprint for ${post.target_role?.replace(/_/g, " ")} positions.`;

  return {
    title: cleanTitle,
    description: cleanDescription,
    keywords: post.tags || ["qa-interview", "software-testing", "qa-lead", post.category, post.tool_stack],
    openGraph: {
      title: cleanTitle,
      description: cleanDescription,
      type: "article",
      url: `https://qahacks.com/posts/${resolvedParams.slug}`,
      siteName: "QA Hacks",
      locale: "en_US",
      publishedTime: new Date().toISOString(),
      authors: ["QA Hacks Team"],
      tags: post.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: cleanDescription,
    },
    alternates: {
      canonical: `https://qahacks.com/posts/${resolvedParams.slug}`,
    },
  };
}

// Hàm phân tách cấu trúc Markdown nội dung để sinh Schema tự động
function parseContentForSchema(content: string) {
  const questionMatch = content.match(/### Interview Question:\s*([\s\S]*?)(?=### Expert Answer:|$)/);
  const answerMatch = content.match(/### Expert Answer:\s*([\s\S]*)/);

  return {
    questionText: questionMatch ? questionMatch[1].trim() : "",
    answerText: answerMatch ? answerMatch[1].trim() : content,
  };
}

// ============================================================================
// 2. MAIN COMPONENT (XỬ LÝ PARAMS PROMISE THEO CHUẨN NEXT.JS)
// ============================================================================
export default async function PostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = await getPostData(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Khối "Continue Learning" lấy 3 bài liên quan để tăng tối đa Pageviews
  const relatedPosts = await getRelatedPosts(resolvedParams.slug, post.category, 3);
  const isCompilation = post.question_type === "Compilation";
  const displayRole = post.target_role?.replace(/_/g, " ");

  const { questionText, answerText = "" } = parseContentForSchema(post.content || "");
  const schemaQuestionTitle = questionText.split("\n")[0] || post.title;

  // STRUCTURED DATA (Schema QAPage - Giúp Google hiển thị box Hỏi-Đáp trực tiếp)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": schemaQuestionTitle.slice(0, 150),
      "text": questionText || post.title,
      "answerCount": 1,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": answerText.slice(0, 5000), // Giới hạn ký tự an toàn cho cấu trúc Schema
        "upvoteCount": 150,
      },
    },
  };

  return (
    <>
      {/* Khai báo Schema Structured Data cho công cụ tìm kiếm */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* [SEO PRIORITIES #1]: BREADCRUMB NAVIGATION */}
          <nav className="flex items-center space-x-2 text-xs font-medium text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-teal-400 transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <Link href={`/?category=${post.category}`} className="hover:text-teal-400 transition-colors capitalize">
              {post.category?.toLowerCase().replace(/_/g, " ")}
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-semibold line-clamp-1">{post.title}</span>
          </nav>

          {/* GRID ARCHITECTURE: 2 COLUMNS ON DESKTOP */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* COLUMN 1: MAIN CONTENT AREA (70%) */}
            <article className="lg:col-span-8 bg-[#0B1121] p-6 sm:p-10 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden h-fit">
              <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-teal-900/10 to-transparent pointer-events-none"></div>

              <div className="relative z-10">
                {/* Meta Labels */}
                <div className="flex flex-wrap gap-2 items-center text-[11px] font-bold uppercase tracking-wider mb-5">
                  <span className={`px-2.5 py-1 rounded border ${isCompilation ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-teal-400 bg-teal-500/10 border-teal-500/20"}`}>
                    {isCompilation ? "⭐ MEGA COMPILATION" : `${post.category} / ${post.sub_category}`}
                  </span>
                  <span className={`px-2.5 py-1 rounded border ${post.difficulty === "Advanced" ? "text-rose-400 bg-rose-500/10 border-rose-500/20" : "text-sky-400 bg-sky-500/10 border-sky-500/20"}`}>
                    {post.difficulty}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Markdown Renderer Area */}
                <div className="prose prose-slate prose-invert max-w-none prose-headings:text-slate-100 prose-a:text-teal-400 hover:prose-a:text-teal-300 prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-slate-800">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    rehypePlugins={[rehypeHighlight, rehypeSlug]}
                    components={{
                      h2: ({ node, ...props }) => {
                        const text = props.children?.toString().toLowerCase() || "";
                        let customId = props.id;
                        
                        if (text.includes("overview")) customId = "overview";

                        return (
                          <h2 
                            {...props} 
                            id={customId} 
                            className="scroll-mt-24 transition-all duration-300" 
                          />
                        );
                      },
                      
                      h3: ({ node, ...props }) => {
                        const text = props.children?.toString().toLowerCase() || "";
                        let customId = props.id;
                        
                        if (text.includes("interview question")) customId = "interview-question";
                        if (text.includes("expert answer")) customId = "expert-answer";
                        if (text.includes("speaking blueprint")) customId = "speaking-blueprint";

                        return (
                          <h3 
                            {...props} 
                            id={customId} 
                            className="scroll-mt-24 transition-all duration-300" 
                          />
                        );
                      }
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              </div>
            </article>

            {/* COLUMN 2: CONTEXT PANEL (SIDEBAR 30%) */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-[#0B1121] p-6 rounded-2xl border border-slate-800 shadow-lg lg:sticky lg:top-6 space-y-5">
                
                {/* Technical Metadata Stack */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">📋 Interview Context</h3>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-sm bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60">
                      <span className="text-slate-400">Target Role:</span>
                      <span className="text-slate-200 font-semibold text-right max-w-[180px] truncate">{displayRole}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60">
                      <span className="text-slate-400">Tool Stack:</span>
                      <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                        {post.tool_stack !== "None" ? post.tool_stack : "Generic"}
                      </span>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-800" />

                {/* Table of Contents Integration */}
                <TableOfContents />

              </div>
            </aside>

          </div>

          {/* FOOTER FLOW: CONTINUE LEARNING (Up Next Carousel) */}
          {relatedPosts && relatedPosts.length > 0 && (
            <section className="mt-12 pt-10 border-t border-slate-800/60 max-w-none">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <span className="bg-teal-500/10 text-teal-400 p-1.5 rounded-lg border border-teal-500/20">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                Continue Learning: Up Next
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {relatedPosts.map((rp) => (
                  <Link
                    href={`/posts/${rp.slug}`}
                    key={rp.slug}
                    className="group block p-5 rounded-xl border border-slate-800/80 bg-[#0B1121]/60 hover:bg-[#0B1121] hover:border-teal-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                      <span className="text-sky-400">{rp.difficulty}</span>
                      <span>•</span>
                      <span>{rp.tool_stack !== 'None' ? rp.tool_stack : rp.category}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-200 group-hover:text-teal-400 line-clamp-2 leading-snug transition-colors">
                      {rp.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
    </>
  );
}