import Link from "next/link";
import SearchBar from "./SearchBar";

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden border-b border-slate-900 bg-[#0B1120] pt-16 pb-20 sm:pt-24 sm:pb-24">
      
      {/* Hiệu ứng ánh sáng nền (Glow Effect) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Thẻ Badge nhấp nháy góc trên */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-medium text-emerald-400 mb-8 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          AI-Powered QA Knowledge Base
        </div>

        {/* Tiêu đề chính */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
          Master QA Automation. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
            Crack the Interview.
          </span>
        </h1>

        {/* Đoạn mô tả */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 mb-10 leading-relaxed">
          Level up your career with production-grade interview questions, real-world code challenges, and system design scenarios tailored for SDETs and QA Leaders.
        </p>

        {/* COMPONENT SEARCH BAR THỰC TẾ (THAY THẾ CHO KHUNG SEARCH ẢO TRƯỚC ĐÂY) */}
        <SearchBar />

        {/* Các đường link gợi ý nhanh (Trending) */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-4 text-sm">
          <span className="text-slate-500 font-medium">Trending:</span>
          <Link href="/?tool=Playwright" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">Playwright</Link>
          <span className="text-slate-700">•</span>
          <Link href="/?tool=Cypress" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">Cypress</Link>
          <span className="text-slate-700">•</span>
          <Link href="/?type=Compilation" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">Top 50 Compilations</Link>
          <span className="text-slate-700">•</span>
          <Link href="/?category=Foundations&sub=Strategy" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">Test Strategy</Link>
        </div>

      </div>
    </div>
  );
}