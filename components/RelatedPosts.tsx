import Link from "next/link";

export default function RelatedPosts({ posts }: { posts: any[] }) {
  // Debug nhẹ: nếu vào đây mà không thấy gì, kiểm tra terminal
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-20 border-t border-slate-800 pt-10">
      <h2 className="text-2xl font-bold text-white mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((rel: any, index: number) => (
          <Link 
            href={`/posts/${rel.slug}`} 
            key={index}
            className="p-6 bg-[#0B1121] rounded-xl border border-slate-800 hover:border-emerald-500 transition-all"
          >
            <h3 className="font-bold text-white mb-2">{rel.title || "Untitled"}</h3>
            <span className="text-xs text-emerald-500">{rel.target_role}</span>
          </Link>
        ))}
      </div>
    </section>
  );

  
}