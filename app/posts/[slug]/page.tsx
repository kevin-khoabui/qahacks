import { getPostData, getRelatedPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import TableOfContents from "@/components/TableOfContents";
import MarkdownContent from "@/components/MarkdownContent";

// 1. IMPORT COMPONENT MỚI
import PostNavigation from "@/components/PostNavigation";

interface Props {
  params: Promise<{ slug: string }>;
}

// ============================================================================
// 2. DYNAMIC METADATA GENERATOR (SEO OPTIMIZATION)
// ============================================================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostData(resolvedParams.slug);

  if (!post) {
    return {
      title: "Article Not Found | QA Hacks",
      description:
        "The requested interview guide or automation tutorial could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const roles = Array.isArray(post.target_role)
    ? post.target_role
    : [post.target_role || "QA Engineer"];

  const categories = Array.isArray(post.category)
    ? post.category
    : [post.category || "General"];

  const displayRoles = roles
    .map((r) => r.replace(/_/g, " "))
    .join(", ");

  const displayCategories = categories
    .map((c) => c.replace(/_/g, " "))
    .join(", ");

  const title = `${post.title} | QA Hacks`;

  const description =
    `${post.title}. Learn expert interview answers, detailed explanations, best practices, common mistakes, and real-world examples for ${displayRoles}.`;

  const canonical = `https://qahacks.com/posts/${post.slug}`;

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    robots: {
      index: true,
      follow: true,
    },

    authors: [
      {
        name: "QA Hacks",
      },
    ],

    publisher: "QA Hacks",

    keywords: [
      post.title,
      ...roles.map((r) => r.replace(/_/g, " ")),
      ...categories.map((c) => c.replace(/_/g, " ")),
      post.tool_stack ?? "",
      post.question_type ?? "",
      "QA Interview",
      "Software Testing",
      "Automation Testing",
      "QA Engineer",
      "Software Engineer Interview",
      "Interview Questions",
      "QA Hacks",
    ].filter(Boolean),

    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "QA Hacks",
      type: "article",

      images: [
        {
          url: "https://qahacks.com/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,

      images: [
        "https://qahacks.com/og-image.png",
      ],
    },
  };
}

// ============================================================================
// 4. MAIN POST PAGE COMPONENT
// ============================================================================
export default async function PostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = await getPostData(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const roles: string[] = Array.isArray(post.target_role)
    ? post.target_role
    : [post.target_role || "QA_Engineer"];

  const categories: string[] = Array.isArray(post.category)
    ? post.category
    : [post.category || "Technical"];

  const primaryCategory = categories[0] || "Technical";

  const relatedPosts = await getRelatedPosts(
    resolvedParams.slug,
    primaryCategory,
    3
  );

  // GIẢ LẬP DỮ LIỆU BÀI TRƯỚC/BÀI SAU (Bạn có thể thêm hàm SQL gọi DB thật sau này)
  const prevPost = null;
  const nextPost = null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* BREADCRUMB */}
        <nav className="flex items-center space-x-2 text-xs font-medium text-slate-400 mb-8">
          <Link href="/" className="hover:text-emerald-400">
            Home
          </Link>

          <span className="text-slate-600">/</span>

          <Link
            href={`/categories/${primaryCategory}`}
            className="hover:text-emerald-400 capitalize"
          >
            {primaryCategory.replace(/_/g, " ")}
          </Link>

          <span className="text-slate-600">/</span>

          <span className="text-slate-300">{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

          {/* Article Schema */}
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                mainEntityOfPage: `https://qahacks.com/posts/${post.slug}`,
                headline: post.title,
                description: `${post.title}. Learn expert interview answers and detailed explanations.`,
                image: [
                  "https://qahacks.com/og-image.png",
                ],
                datePublished: post.date,
                dateModified: post.date,
                author: {
                  "@type": "Organization",
                  name: "QA Hacks",
                },
                publisher: {
                  "@type": "Organization",
                  name: "QA Hacks",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://qahacks.com/logo-1024.png",
                  },
                },
              }),
            }}
          />

          {/* Breadcrumb Schema */}
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://qahacks.com",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: primaryCategory.replace(/_/g, " "),
                    item: `https://qahacks.com/categories/${primaryCategory}`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: post.title,
                    item: `https://qahacks.com/posts/${post.slug}`,
                  },
                ],
              }),
            }}
          />

          <article className="lg:col-span-8 bg-[#0B1121] p-6 sm:p-10 rounded-2xl border border-slate-800">
            {/* METADATA TAGS */}
            <div className="flex flex-wrap items-center gap-2 mb-6 text-[11px] font-bold uppercase tracking-wider">
              <span className="text-emerald-400 bg-emerald-950/40 border-emerald-900/30 px-3 py-1 rounded border">
                {primaryCategory.replace(/_/g, " ")}
              </span>

              <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded border border-slate-700">
                {post.difficulty}
              </span>

              {post.tool_stack && post.tool_stack !== "None" && (
                <span className="bg-sky-950/40 text-sky-400 px-3 py-1 rounded border border-sky-900/30">
                  {post.tool_stack}
                </span>
              )}
            </div>

            {/* TITLE */}
            <h1 className="text-3xl font-extrabold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* TARGET ROLES */}
            <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-slate-800">
              {roles.map((role) => (
                <span
                  key={role}
                  className="text-[10px] text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800"
                >
                  {role.replace(/_/g, " ")}
                </span>
              ))}
            </div>

            {/* POST CONTENT */}
            <div className="prose prose-invert prose-emerald max-w-none">
              <MarkdownContent content={post.content || ""} />
            </div>
          </article>

          {/* SIDEBAR */}
          <aside className="lg:col-span-3">
            <TableOfContents />
          </aside>
        </div>

        {/* 2. CHÈN POST NAVIGATION & CTA VÀO ĐÂY (NGAY DƯỚI BÀI VIẾT) */}
        <PostNavigation prevPost={prevPost} nextPost={nextPost} />

        {/* RELATED POSTS */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="mt-12 pt-10 border-t border-slate-800/60 max-w-none">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <span className="bg-emerald-500/10 text-emerald-400 p-1.5 rounded-lg border border-emerald-500/20">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </span>
              Continue Learning: Up Next
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedPosts.map((rp: (typeof relatedPosts)[0]) => {
                const rpCategory = Array.isArray(rp.category)
                  ? rp.category[0]
                  : rp.category;

                const displayRpCategory = rpCategory
                  ? rpCategory.replace(/_/g, " ")
                  : "General";

                return (
                  <Link
                    href={`/posts/${rp.slug}`}
                    key={rp.slug}
                    className="group block p-5 rounded-xl border border-slate-800/80 bg-[#0B1121]/60 hover:bg-[#0B1121] hover:border-emerald-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                      <span className="text-sky-400">{rp.difficulty}</span>
                      <span>•</span>
                      <span>
                        {rp.tool_stack && rp.tool_stack !== "None"
                          ? rp.tool_stack
                          : displayRpCategory}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400 line-clamp-2 leading-snug transition-colors">
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
  );
}