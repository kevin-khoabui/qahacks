import Link from 'next/link';

interface ArticleCardProps {
  title: string;
  category: string;
  difficulty: string;
  targetRole: string | string[]; // Sửa thành union type đề phòng dữ liệu đa thẻ dạng mảng
  toolStack: string;
  slug: string;
}

export default function ArticleCard({
  title,
  category,
  difficulty,
  targetRole,
  toolStack,
  slug
}: ArticleCardProps) {
  // Chuẩn hóa an toàn cho trường targetRole (xử lý nếu dữ liệu từ file .md đổ về dạng mảng)
  const rolesArray = Array.isArray(targetRole) ? targetRole : [targetRole || ""];

  return (
    // 🚀 FIX LỖI: Đồng bộ về route /posts/ chuẩn chỉ của dự án qahacks
    <Link href={`/posts/${slug}`} className="group block">
      <div className="relative bg-slate-900/40 border border-slate-900/60 rounded-2xl p-6 transition-all duration-200 hover:border-emerald-500/40 hover:bg-slate-900/80 flex flex-col h-full">

        {/* Khu vực 1: Meta Tags (Pills) */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[10px] font-semibold uppercase tracking-wider">
          <span className="text-emerald-400 bg-emerald-950/40 border-emerald-900/30 px-2 py-0.5 rounded border">
            {category.replace(/_/g, " ")}
          </span>
          <span className="bg-slate-900/50 text-slate-400 px-2 py-0.5 rounded border border-slate-800/30">
            {difficulty}
          </span>
          {toolStack && toolStack !== "None" && (
            <span className="bg-sky-950/40 text-sky-400 px-2 py-0.5 rounded border border-sky-900/30">
              {toolStack}
            </span>
          )}
        </div>

        {/* Khu vực 2: Tiêu đề bài viết */}
        <h2 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-3 leading-snug mb-4">
          {title}
        </h2>

        {/* Khu vực 3: Metadata đa thẻ (Duyệt mảng Target Roles sạch sẽ) */}
        <div className="mt-auto pt-4 border-t border-slate-900/40 flex flex-wrap gap-1">
          {rolesArray.map((role: string) => {
            if (!role) return null;
            return (
              <span 
                key={role} 
                className="text-[9px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800/40 tracking-wide"
              >
                {role.replace(/_/g, " ")}
              </span>
            );
          })}
        </div>

        {/* Khu vực 4: Call to Action - Đồng bộ hiệu ứng lướt mũi tên mũi */}
        <div className="mt-5 flex items-center text-xs font-semibold text-slate-500 group-hover:text-emerald-400 transition-colors pt-2">
          Practice Solution
          <svg
            className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>

      </div>
    </Link>
  );
}