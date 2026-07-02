// app/companies/[source]/page.tsx
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { notFound } from "next/navigation";
import CategoryPaginationClient from "@/components/CategoryPaginationClient";
import { Metadata } from "next";

function formatLabel(value: string) {
  const labelMap: Record<string, string> = {
    'FAANG_DSA': 'Google / Meta',
    'Amazon_Microsoft': 'Amazon / Microsoft',
    'Startup_General': 'Startup & Agency'
  };
  return labelMap[value] || value.replace(/_/g, " ");
}

// 2. Metadata động cho SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { source } = await params;
  const title = formatLabel(source);
  return {
    title: `${title} Interview Questions | QA Hacks`,
    description: `Curated interview questions and preparation path for ${title}.`,
  };
}

interface Props {
  params: Promise<{ source: string }>;
}

export default async function CompanyPage({ params }: Props) {
  const { source } = await params;
  const formattedSource = formatLabel(source);
  const decodedSource = source.replace(/_/g, " ");
  const db = (getCloudflareContext().env as any).DB;

  // Truy vấn dữ liệu
  const { results } = await db
    .prepare("SELECT * FROM posts WHERE interview_source = ?")
    .bind(source)
    .all();

  if (!results || results.length === 0) {
    notFound();
  }

  // Map dữ liệu để khớp với định dạng mà CategoryPaginationClient mong đợi
  const posts = results.map((post: any) => ({
    ...post,
    category: JSON.parse(post.category || '[]'),
    target_role: typeof post.target_role === 'string' 
      ? post.target_role.replace(/\["|"\]/g, '').replace(/_/g, ' ') 
      : post.target_role
  }));

  return (
    <main className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div id="category-hub-top" className="mb-12">
          <h1 className="text-3xl font-black text-white capitalize tracking-tight">
            {formattedSource}
            <span className="text-slate-600 font-normal ml-3">({posts.length} items)</span>
          </h1>
          <p className="mt-4 text-slate-400">
{/*            <p className="mt-4 text-slate-400 max-w-2xl">
 */}
            Explore curated interview content specifically for <strong>{formattedSource}</strong>. Master the technical challenges and engineering standards required.
          
          </p>
        </div>
        
        {/* Tái sử dụng component Pagination của các trang kia */}
        <CategoryPaginationClient posts={posts} />
      </div>
    </main>
  );
}