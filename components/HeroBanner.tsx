import Link from "next/link";
import SearchBar from "./SearchBar";

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden border-b border-slate-900 bg-[#0B1121] pt-8 pb-10 sm:pt-12 sm:pb-14">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-50 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none"></div>

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-4">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          AI Base
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3 leading-tight">
          Master QA Automation.{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-300">
            Crack the Interview.
          </span>
        </h1>

        <p className="max-w-lg mx-auto text-xs text-slate-400 mb-6 leading-relaxed">
          Production-grade interview questions, real-world code challenges, and system design blueprints tailored for SDETs and QA Leaders.
        </p>

        <div className="max-w-xl mx-auto">
          <SearchBar />
        </div>

        <div className="mt-6 flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5 text-xs text-slate-400">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Trending:</span>
          
          <Link 
            href="/tools/Playwright" 
            className="hover:text-emerald-400 font-semibold transition-colors border-b border-transparent hover:border-emerald-500/30 pb-0.5"
          >
            Playwright
          </Link>
          
          <span className="text-slate-800 hidden sm:inline">•</span>
          
          <Link 
            href="/tools/Cypress" 
            className="hover:text-emerald-400 font-semibold transition-colors border-b border-transparent hover:border-emerald-500/30 pb-0.5"
          >
            Cypress
          </Link>
          
          <span className="text-slate-800 hidden sm:inline">•</span>

          <Link 
            href="/categories/Technical" 
            className="hover:text-emerald-400 font-semibold transition-colors border-b border-transparent hover:border-emerald-500/30 pb-0.5"
          >
            Technical
          </Link>

          <span className="text-slate-800 hidden sm:inline">•</span>

          <Link 
            href="/types/Compilation" 
            className="text-amber-500 hover:text-amber-400 font-bold bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 hover:border-amber-500/20 text-[11px]"
          >
            Mega Compilations
          </Link>
        </div>

      </div>
    </div>
  );
}