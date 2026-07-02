import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";

interface PostInfo {
  slug: string;
  title: string;
}

interface PostNavigationProps {
  prevPost?: PostInfo | null;
  nextPost?: PostInfo | null;
}

export default function PostNavigation({ prevPost, nextPost }: PostNavigationProps) {
  return (
    <div className="mt-16 w-full max-w-4xl mx-auto border-t border-slate-800/60 pt-10">
      
      {/* 1. KHỐI CTA ĐIỀU HƯỚNG SANG SUBSTACK */}
      <div className="mb-12 p-8 sm:p-10 bg-gradient-to-br from-slate-900 to-[#0B1121] rounded-3xl border border-emerald-500/20 text-center relative overflow-hidden shadow-2xl">
        {/* Lớp ánh sáng mờ trang trí nền */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>
        
        <h3 className="text-xl sm:text-2xl font-black text-white mb-3 relative z-10 tracking-tight">
          Want more deep-dives like this? 🚀
        </h3>
        
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base mb-8 leading-relaxed relative z-10">
          Join the premium newsletter to get weekly advanced automation frameworks, exclusive FAANG interview breakdowns, and real-world QA leadership case studies.
        </p>
        
        <a 
          href={SITE_CONFIG.links.substack}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm hover:bg-emerald-400 transition-all hover:scale-105 shadow-[0_0_30px_rgba(52,211,153,0.3)]"
        >
          Subscribe to Substack 📩
        </a>
        <p className="mt-4 text-[11px] text-slate-500 relative z-10">
          Join other elite QA Engineers. Free and paid plans available.
        </p>
      </div>

      {/* 2. KHỐI ĐIỀU HƯỚNG BÀI VIẾT (PREV/NEXT) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nút Bài Trước (Bên Trái) */}
        {prevPost ? (
          <Link 
            href={`/posts/${prevPost.slug}`} 
            className="group flex flex-col p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all text-left"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2 group-hover:text-emerald-500/70 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </span>
            <span className="text-sm font-semibold text-slate-300 group-hover:text-emerald-400 line-clamp-2 transition-colors">
              {prevPost.title}
            </span>
          </Link>
        ) : (
          <div className="hidden sm:block"></div> /* Giữ layout cân bằng nếu không có bài trước */
        )}

        {/* Nút Bài Tiếp Theo (Bên Phải) */}
        {nextPost ? (
          <Link 
            href={`/posts/${nextPost.slug}`} 
            className="group flex flex-col p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all text-right items-end"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2 group-hover:text-emerald-500/70 transition-colors">
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-slate-300 group-hover:text-emerald-400 line-clamp-2 transition-colors text-right">
              {nextPost.title}
            </span>
          </Link>
        ) : (
          <div></div>
        )}
      </div>

    </div>
  );
}