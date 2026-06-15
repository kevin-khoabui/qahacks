import Link from "next/link";
import SearchBar from "./SearchBar";

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden border-b border-slate-900 bg-[#0B1120] pt-16 pb-20 sm:pt-24 sm:pb-24">
      
      {/* 1. Hiệu ứng ánh sáng nền (Consulting-grade Glow Effect) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* 2. Thẻ Badge AI Status */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-8 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          AI-Powered QA Knowledge Base
        </div>

        {/* 3. Tiêu đề chính (Main H1 Heading) */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
          Master QA Automation. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
            Crack the Interview.
          </span>
        </h1>

        {/* 4. Đoạn mô tả (Value Proposition) */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 mb-10 leading-relaxed font-medium">
          Level up your career with production-grade interview questions, real-world code challenges, and system design scenarios tailored for SDETs and QA Leaders.
        </p>

        {/* 5. Khối tìm kiếm thực tế (Search Logic Container) */}
        <div className="max-w-2xl mx-auto">
          <SearchBar />
        </div>

        {/* 6. Liên kết gợi ý nhanh (Trending - ĐÃ ĐỒNG BỘ CHỮ THƯỜNG TRÊN ROUTE ĐỂ KHỚP SSG) */}
        <div className="mt-10 flex flex-wrap justify-center items-center gap-x-5 gap-y-3 text-xs sm:text-sm">
          <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Trending:</span>
          
          {/* 🚀 Đồng bộ route chữ thường /playwright - Khớp 100% với Static Params */}
          <Link 
            href="/tools/playwright" 
            className="text-slate-300 hover:text-emerald-400 transition-all duration-200 font-semibold border-b border-transparent hover:border-emerald-500/50 pb-0.5"
          >
            Playwright
          </Link>
          
          <span className="text-slate-800 hidden sm:inline">•</span>
          
          {/* 🚀 Đồng bộ route chữ thường /cypress - Khớp 100% với Static Params */}
          <Link 
            href="/tools/cypress" 
            className="text-slate-300 hover:text-emerald-400 transition-all duration-200 font-semibold border-b border-transparent hover:border-emerald-500/50 pb-0.5"
          >
            Cypress
          </Link>
          
          <span className="text-slate-800 hidden sm:inline">•</span>

          {/* 🚀 Đồng bộ route chữ thường /generic - Khớp 100% với Static Params */}
          <Link 
            href="/tools/generic" 
            className="text-slate-300 hover:text-emerald-400 transition-all duration-200 font-semibold border-b border-transparent hover:border-emerald-500/50 pb-0.5"
          >
            Test Strategy
          </Link>

          <span className="text-slate-800 hidden sm:inline">•</span>

          {/* Giữ nguyên bộ lọc động tinh chỉnh tại trang chủ cho khối tổng hợp */}
          <Link 
            href="/#question_type=Compilation" 
            className="text-amber-500 hover:text-amber-400 transition-all duration-200 font-bold bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 hover:border-amber-500/30"
          >
            Top 50 Compilations
          </Link>
        </div>

      </div>
    </div>
  );
}