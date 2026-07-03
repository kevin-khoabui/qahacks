import { getCloudflareContext } from "@opennextjs/cloudflare";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import CategoryPaginationClient from "../../../components/CategoryPaginationClient";

interface Props {
  params: Promise<{ slug: string }>;
}

// 🚀 1. SEO Metadata động cho mỗi Category
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).replace(/_/g, " ");
  
  return {
    title: `${decodedSlug} | QA Hacks Testing Resources`,
    description: `Explore our collection of ${decodedSlug} guides, interview questions, and automation tutorials for software engineers and QA professionals.`,
    keywords: [decodedSlug, "QA interview", "software testing", "developer guides", "QA Hacks", "automation engineering"],
    // BỔ SUNG: Khai báo Canonical để nhóm tất cả các URL tham số phân trang/filter về URL gốc này
    alternates: {
      canonical: `https://qahacks.com/categories/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug); 
  const db = (getCloudflareContext().env as any).DB;

  const { results } = await db.prepare(
    "SELECT * FROM posts WHERE LOWER(category) LIKE ?"
  )
  .bind(`%"${decodedSlug.toLowerCase()}"%`)
  .all();

  if (!results || results.length === 0) {
    notFound(); 
  }

  const posts = results.map((post: any) => ({
    ...post,
    category: JSON.parse(post.category || '[]'),
  }));

  // 🚀 2. SEO SCHEMA: CollectionPage cho trang danh mục
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": decodedSlug.replace(/_/g, " "),
    "description": `Resources and articles covering ${decodedSlug.replace(/_/g, " ")} topics.`,
    "numberOfItems": posts.length
  };

  return (
    <main className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      {/* Inject Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-6xl mx-auto">
        <div id="category-hub-top" className="mb-12">
          <h1 className="text-3xl font-black text-white capitalize tracking-tight">
            {decodedSlug.replace(/_/g, " ")} 
            <span className="text-slate-600 font-normal ml-3">({posts.length} items)</span>
          </h1>
          {/* SEO Content: Thêm một đoạn text ngắn cho Google cào */}
          <p className="mt-4 text-slate-400">
            Browse our expert-curated collection of <strong>{decodedSlug.replace(/_/g, " ")}</strong> resources. 
            Designed for developers, software engineers, and QA leads to master testing methodologies.
          </p>
        </div>
        
        <CategoryPaginationClient posts={posts} />
      </div>
    </main>
  );
}