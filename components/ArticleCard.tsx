import Link from 'next/link';

interface ArticleCardProps {
  title: string;
  category: string;
  difficulty: string;
  targetRole: string;
  toolStack: string;
  slug: string; // Đường dẫn URL của bài viết
}

export default function ArticleCard({ 
  title, 
  category, 
  difficulty, 
  targetRole, 
  toolStack, 
  slug 
}: ArticleCardProps) {
  return (
    <Link href={`/guides/${slug}`} className="group block">
      <div className="relative bg-[#111827] border border-gray-800 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/50 hover:shadow-[0_8px_24px_rgba(20,184,166,0.15)] flex flex-col h-full">
        
        {/* Khu vực 1: Meta Tags (Pills) */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-bold tracking-wider uppercase">
          <span className="text-teal-400 bg-teal-400/10 px-2 py-1 rounded">
            {category}
          </span>
          <span className="text-slate-400 border border-slate-700 px-2 py-1 rounded">
            {difficulty}
          </span>
        </div>

        {/* Khu vực 2: Tiêu đề bài viết */}
        <h3 className="text-xl font-semibold text-gray-100 mb-4 group-hover:text-teal-300 transition-colors duration-200 line-clamp-2">
          {title}
        </h3>

        {/* Khu vực 3: Metadata thực chiến (Tool & Role) */}
        <div className="mt-auto pt-4 border-t border-gray-800/50 flex flex-col gap-2">
          <div className="flex items-center text-sm text-slate-400">
            <span className="w-16">Role:</span>
            <span className="text-gray-300 font-medium">{targetRole.replace(/_/g, ' ')}</span>
          </div>
          <div className="flex items-center text-sm text-slate-400">
            <span className="w-16">Tool:</span>
            <span className="text-gray-300 font-medium">{toolStack}</span>
          </div>
        </div>

        {/* Khu vực 4: Call to Action */}
        <div className="mt-6 flex items-center text-sm font-semibold text-slate-500 group-hover:text-teal-400 transition-colors duration-200">
          Practice Solution
          <svg 
            className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        
      </div>
    </Link>
  );
}