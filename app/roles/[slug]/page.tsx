import { getCloudflareContext } from "@opennextjs/cloudflare";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import CategoryPaginationClient from "../../../components/CategoryPaginationClient";

// export const runtime = 'edge';

interface Props {
  params: Promise<{ slug: string }>;
}

// 🚀 1. SEO Metadata động cho trang Roles
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).replace(/_/g, " ");
  
  return {
    title: `${decodedSlug} | QA Hacks Role Blueprint`,
    description: `Comprehensive interview questions and testing guides for ${decodedSlug} positions. Master the skills required for software engineers, developers, and QA leads.`,
    keywords: [decodedSlug, "QA interview", "software testing", "software engineer", "developer", "QA Lead", "career blueprint"],
  };
}

export default async function RolePage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).replace(/_/g, " "); 
  const db = (getCloudflareContext().env as any).DB;

  const searchString = `["${decodedSlug.replace(/ /g, "_")}"]`;
  const { results } = await db.prepare(
    "SELECT * FROM posts WHERE target_role = ?"
  )
  .bind(searchString)
  .all();

  if (!results || results.length === 0) {
    notFound();
  }

  const posts = results.map((post: any) => ({
    ...post,
    category: JSON.parse(post.category || '[]'),
    target_role: post.target_role.replace(/\["|"\]/g, '').replace(/_/g, ' ') 
  }));

  // 🚀 2. SEO SCHEMA: CollectionPage cho trang Role
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${decodedSlug} Career Blueprint`,
    "description": `Testing resources and career guides specifically curated for ${decodedSlug}.`,
    "numberOfItems": posts.length
  };

  return (
    <main className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      {/* Inject Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-6xl mx-auto">
        <div id="category-hub-top" className="mb-12">
          <h1 className="text-3xl font-black text-white capitalize tracking-tight">
            {decodedSlug}
            <span className="text-slate-600 font-normal ml-3">({posts.length} items)</span>
          </h1>
          {/* SEO Content: Bổ sung thêm mô tả vai trò cho Google */}
          <p className="mt-4 text-slate-400 max-w-2xl">
            Access the ultimate interview preparation path for <strong>{decodedSlug}</strong>. 
            From fundamental testing concepts to advanced automation strategies required by senior developers and QA leads.
          </p>
        </div>
        
        <CategoryPaginationClient posts={posts} />
      </div>
    </main>
  );
}