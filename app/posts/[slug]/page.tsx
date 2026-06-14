import fs from "fs";
import path from "path";
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
// 🚀 FIX LỖI 1: BẮT BUỘC PHẢI CÓ HÀM NÀY KHI DÙNG CHẾ ĐỘ OUTPUT: EXPORT
// ============================================================================
export async function generateStaticParams() {
  const jsonPath = path.resolve(process.cwd(), "public", "content", "posts.generated.json");
  
  if (!fs.existsSync(jsonPath)) {
    console.warn("⚠️ Cảnh báo: Chưa tìm thấy tệp posts.generated.json lúc biên dịch!");
    return [];
  }

  try {
    const fileContents = fs.readFileSync(jsonPath, "utf8");
    const posts = JSON.parse(fileContents);
    
    return posts.map((post: { slug: string }) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("❌ Lỗi quét danh sách slug trong generateStaticParams:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostData(resolvedParams.slug);

  if (!post) {
    return {
      title: "Article Not Found | QA Hacks",
      description: "The requested QA automation tutorial or interview guide does not exist or has been moved.",
    };
  }

  // Chuẩn hóa mảng thẻ thành chuỗi để làm Description/Keywords
  const rolesArray = Array.isArray(post.target_role) ? post.target_role : [post.target_role || ""];
  const categoriesArray = Array.isArray(post.category) ? post.category : [post.category || ""];
  
  // 🔍 SỬA CHỖ NÀY: Thay thế triệt để dấu gạch dưới trong chuỗi mô tả SEO
  const displayRoles = rolesArray.map(r => r.replace(/_/g, " ")).join(", ");

  const cleanTitle = `${post.title} | QA Hacks`;
  const cleanDescription = `Master the QA Interview: ${post.title}. Professional solution and speaking blueprint for ${displayRoles || "QA"} positions.`;

  return {
    title: cleanTitle,
    description: cleanDescription,
    keywords: post.tags || ["qa-interview", "software-testing", "qa-lead", ...categoriesArray.map(c => c.replace(/_/g, " ")), post.tool_stack],
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

function parseContentForSchema(content: string) {
  const questionMatch = content.match(/### Interview Question(?:\s+\d+)?:\s*([\s\S]*?)(?=### Expert Answer|$)/i);
  const answerMatch = content.match(/### Expert Answer(?:\s+\d+)?:\s*([\s\S]*)/i);

  return {
    questionText: questionMatch ? questionMatch[1].trim() : "",
    answerText: answerMatch ? answerMatch[1].trim() : content,
  };
}

export default async function PostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = await getPostData(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Ép kiểu dữ liệu mảng an toàn đề phòng file cũ chưa đồng bộ
  const roles: string[] = Array.isArray(post.target_role) ? post.target_role : [post.target_role || "QA_Engineer"];
  const categories: string[] = Array.isArray(post.category) ? post.category : [post.category || "Technical"];

  // Bốc liên đới liên quan dựa trên phần tử danh mục đầu tiên trong mảng dữ liệu tĩnh
  const primaryCategory = categories[0] || "Technical";
  const relatedPosts = await getRelatedPosts(resolvedParams.slug, primaryCategory, 3);

  const { questionText, answerText = "" } = parseContentForSchema(post.content || "");
  const schemaQuestionTitle = questionText.split("\n")[0] || post.title;

  const postUrl = `https://qahacks.com/posts/${resolvedParams.slug}`;
  const authorName = "QA Hacks Team";
  const currentDate = new Date().toISOString();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": schemaQuestionTitle.slice(0, 150),
      "text": questionText || post.title,
      "datePublished": (post as any).date || currentDate,
      "url": postUrl,
      "answerCount": 1,
      "author": {
        "@type": "Person",
        "name": authorName,
        "url": "https://qahacks.com"
      },
      "acceptedAnswer": {
        "@type": "Answer",
        "text": answerText.slice(0, 5000),
        "datePublished": (post as any).date || currentDate,
        "url": `${postUrl}#expert-answer`,
        "upvoteCount": 150,
        "author": {
          "@type": "Person",
          "name": authorName,
          "url": "https://qahacks.com"
        }
      }
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* BREADCRUMB */}
          <nav className="flex items-center space-x-2 text-xs font-medium text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-teal-400 transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            {/* 🔍 SỬA CHỖ NÀY: Gọt dấu gạch dưới cho chuỗi hiển thị trên Breadcrumb */}
            <Link href={`/?category=${primaryCategory}`} className="hover:text-teal-400 transition-colors capitalize">
              {primaryCategory.toLowerCase().replace(/_/g, " ")}
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-semibold line-clamp-1">{post.title}</span>
          </nav>

          {/* MAIN GRID STRUCT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

            {/* MAIN ARTICLE BLOCK */}
            <article className="lg:col-span-8 bg-[#0B1121] p-6 sm:p-10 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden h-fit">
              <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-teal-900/10 to-transparent pointer-events-none"></div>

              <div className="relative z-10">
                {/* ĐA THẺ METATAGS: Duyệt mảng category tự động và xóa bỏ dấu gạch dưới */}
                <div className="flex flex-wrap gap-2 items-center text-[11px] font-bold uppercase tracking-wider mb-5">
                  {categories.map((cat) => (
                    <span key={cat} className="px-2.5 py-1 rounded border text-teal-400 bg-teal-500/10 border-teal-500/20">
                      {cat.replace(/_/g, " ")} {post.sub_category ? `/ ${post.sub_category.replace(/_/g, " ")}` : ""}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 rounded border text-rose-400 bg-rose-500/10 border-rose-500/20">
                    {post.difficulty}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* MOBILE ONLY COMPONENT LAYOUT */}
                <div className="block lg:hidden space-y-4 mb-8">
                  <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 space-y-2.5">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/80 pb-2">
                      📋 Interview Context
                    </h3>
                    
                    {/* Duyệt đa Role trên Mobile và làm sạch chữ */}
                    <div className="flex flex-col gap-2 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60">
                      <span className="text-xs text-slate-400">Target Roles:</span>
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        {roles.map((role) => (
                          <Link
                            key={role}
                            href={`/?role=${role}`}
                            className="text-teal-400 hover:text-teal-300 font-semibold text-xs underline decoration-dotted transition-colors cursor-pointer"
                          >
                            {role.replace(/_/g, " ")}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Tool Stack:</span>
                      <Link
                        href={`/?tool=${post.tool_stack}`}
                        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 font-bold px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20 transition-colors cursor-pointer"
                      >
                        {post.tool_stack !== "None" ? post.tool_stack : "Generic"}
                      </Link>
                    </div>
                  </div>

                  <TableOfContents />
                </div>

                {/* Content body */}
                <div className="prose prose-slate prose-invert max-w-none prose-headings:text-slate-100 prose-a:text-teal-400 hover:prose-a:text-teal-300">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeSlug]}
                    components={{
                      h3: ({ node, ...props }) => {
                        const text = props.children?.toString() || "";
                        const textLower = text.toLowerCase();
                        let customId = props.id;

                        const numMatch = text.match(/\b(\d+)\b/);
                        const suffix = numMatch ? `-${numMatch[1]}` : "";

                        if (textLower.includes("interview question")) customId = `interview-question${suffix}`;
                        if (textLower.includes("expert answer")) customId = `expert-answer${suffix}`;
                        if (textLower.includes("speaking blueprint")) customId = `speaking-blueprint${suffix}`;

                        return <h3 {...props} id={customId} className="scroll-mt-24 transition-all duration-300" />;
                      }
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              </div>
            </article>

            {/* SIDEBAR CONTAINER (DESKTOP ONLY) */}
            <aside className="lg:col-span-4 h-full">
              <div className="hidden lg:block bg-[#0B1121] p-6 rounded-2xl border border-slate-800 shadow-lg lg:sticky lg:top-6 space-y-5">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">📋 Interview Context</h3>
                  <div className="space-y-3">
                    
                    {/* Duyệt đa Role trên Desktop Sidebar và gọt sạch dấu gạch dưới */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs text-slate-400">Target Roles:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {roles.map((role) => (
                          <Link
                            key={role}
                            href={`/?role=${role}`}
                            className="text-teal-400 hover:text-teal-300 font-semibold text-xs underline decoration-dotted transition-colors cursor-pointer"
                          >
                            {role.replace(/_/g, " ")}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1.5 border-t border-slate-900">
                      <span className="text-slate-400">Tool Stack:</span>
                      <Link
                        href={`/?tool=${post.tool_stack}`}
                        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 font-bold px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20 transition-colors cursor-pointer"
                      >
                        {post.tool_stack !== "None" ? post.tool_stack : "Generic"}
                      </Link>
                    </div>
                  </div>
                </div>
                <hr className="border-slate-800" />
                <TableOfContents />
              </div>
            </aside>
          </div>

          {/* RELATED POSTS */}
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
                {relatedPosts.map((rp) => {
                  // 🔍 SỬA CHỖ NÀY: Gọt sạch dấu gạch dưới cho category của các bài viết liên quan ở footer
                  const rpCategory = Array.isArray(rp.category) ? rp.category[0] : rp.category;
                  const displayRpCategory = rpCategory ? rpCategory.replace(/_/g, " ") : "General";

                  return (
                    <Link
                      href={`/posts/${rp.slug}`}
                      key={rp.slug}
                      className="group block p-5 rounded-xl border border-slate-800/80 bg-[#0B1121]/60 hover:bg-[#0B1121] hover:border-teal-500/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                        <span className="text-sky-400">{rp.difficulty}</span>
                        <span>•</span>
                        <span>{rp.tool_stack !== 'None' ? rp.tool_stack : displayRpCategory}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-200 group-hover:text-teal-400 line-clamp-2 leading-snug transition-colors">
                        {rp.title}
                      </h3>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

        </div>
      </main>
    </>
  );
}