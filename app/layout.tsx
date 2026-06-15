import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { getAllPosts } from "@/lib/posts";
import CommandPalette from "@/components/CommandPalette";
import NavbarSearchButton from "@/components/NavbarSearchButton";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QAHacks | Ultimate QA Interview Hub & Automation Handbook",
  description: "Master software automation testing with production-grade QA interview questions, advanced code challenges, framework best practices, and mega compilations.",
  metadataBase: new URL("https://qahacks.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const allPosts = getAllPosts();

  const searchData = allPosts.map(post => {
    const rawCategory = post.category;
    const cleanCategoryString = Array.isArray(rawCategory) ? (rawCategory[0] || "General") : (rawCategory || "General");
    return {
      slug: post.slug,
      title: post.title,
      category: cleanCategoryString.replace(/_/g, " "),
      tool: (post as any).tool_stack || "None"
    };
  });

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}>

        <header className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 group-hover:border-emerald-500/50 transition-colors p-1">
                <img src="/icon" alt="QA Icon" className="h-full w-full object-contain" />
              </div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-teal-200 transition-all">
                QA<span className="text-white">Hacks</span>
              </span>
            </Link>

            {/* 🎯 HỆ THỐNG MENU SIÊU LỌC ĐÃ CHUYỂN ĐỔI THÀNH SEO STATIC URL */}
            <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-400">
              <Link href="/" className="hover:text-emerald-400 transition-colors">Dashboard</Link>

              {/* 1. DROPDOWN: ROLES & TYPES */}
              <div className="relative group py-2">
                <button className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer">
                  Roles & Types
                  <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute left-0 top-full pt-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl space-y-1">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2 py-1">Question Type</div>
                    <Link href="/types/Compilation" className="block px-2.5 py-1.5 text-xs rounded-lg text-amber-400 hover:bg-slate-800 transition-colors">⭐ Mega Compilations</Link>
                    <Link href="/types/Situational" className="block px-2.5 py-1.5 text-xs rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">Situational Cases</Link>
                    <div className="h-px bg-slate-800 my-1"></div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2 py-1">Target Roles</div>
                    <Link href="/roles/Manual_QA_Engineer" className="block px-2.5 py-1.5 text-xs rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">Manual QA Engineer</Link>
                    <Link href="/roles/Automation_QA_Engineer" className="block px-2.5 py-1.5 text-xs rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">Automation QA (SDET)</Link>
                    <Link href="/roles/QA_Lead" className="block px-2.5 py-1.5 text-xs rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">QA Lead / Manager</Link>
                  </div>
                </div>
              </div>

              {/* 2. DROPDOWN: CATEGORIES & STRATEGY */}
              <div className="relative group py-2">
                <button className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer">
                  Foundations
                  <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute left-0 top-full pt-2 w-52 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl space-y-1">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2 py-1">Category</div>
                    <Link href="/categories/Analytical_Behavioral" className="block px-2.5 py-1.5 text-xs rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">Analytical & Behavioral</Link>
                    <Link href="/categories/Technical" className="block px-2.5 py-1.5 text-xs rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">Technical Architecture</Link>
                    <div className="h-px bg-slate-800 my-1"></div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2 py-1">Sub Category</div>
                    <Link href="/sub-categories/Strategy" className="block px-2.5 py-1.5 text-xs rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">Test Strategy & Planning</Link>
                    <Link href="/sub-categories/Automation" className="block px-2.5 py-1.5 text-xs rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">Automation execution</Link>
                  </div>
                </div>
              </div>

              {/* 3. DROPDOWN: CORE TYPE / DOMAIN / PLATFORM */}
              <div className="relative group py-2">
                <button className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer">
                  Methodologies
                  <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute left-0 top-full pt-2 w-56 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl space-y-1">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2 py-1">Core Testing Type</div>
                    <Link href="/testing-types/Manual" className="block px-2.5 py-1.5 text-xs rounded-lg text-teal-400 hover:bg-slate-800 transition-colors">Manual Execution</Link>
                    <Link href="/testing-types/Automation" className="block px-2.5 py-1.5 text-xs rounded-lg text-sky-400 hover:bg-slate-800 transition-colors">Automated Scripts</Link>
                    <div className="h-px bg-slate-800 my-1"></div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2 py-1">Domain</div>
                    <Link href="/domains/Enterprise-Software" className="block px-2.5 py-1.5 text-xs rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">Enterprise Software</Link>
                    <Link href="/domains/Banking_Finance" className="block px-2.5 py-1.5 text-xs rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">Banking & Finance</Link>
                    <div className="h-px bg-slate-800 my-1"></div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2 py-1">Platform</div>
                    <Link href="/platforms/Cross-platform" className="block px-2.5 py-1.5 text-xs rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">Cross-platform</Link>
                    <Link href="/platforms/Web" className="block px-2.5 py-1.5 text-xs rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">Web Applications</Link>
                  </div>
                </div>
              </div>

              {/* 4. DROPDOWN: TOOLS & DIFFICULTIES */}
              <div className="relative group py-2">
                <button className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer">
                  Tools & Difficulty
                  <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute left-0 top-full pt-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl space-y-1">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2 py-1">Tool Stack</div>
                    <Link href="/tools/Playwright" className="block px-2.5 py-1.5 text-xs rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">Playwright</Link>
                    <Link href="/tools/Cypress" className="block px-2.5 py-1.5 text-xs rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">Cypress</Link>
                    <Link href="/tools/None" className="block px-2.5 py-1.5 text-xs rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">Generic (No Tool)</Link>
                    <div className="h-px bg-slate-800 my-1"></div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2 py-1">Difficulty</div>
                    <Link href="/difficulties/Intermediate" className="block px-2.5 py-1.5 text-xs rounded-lg text-yellow-500 hover:bg-slate-800 transition-colors">Intermediate</Link>
                    <Link href="/difficulties/Advanced" className="block px-2.5 py-1.5 text-xs rounded-lg text-rose-500 hover:bg-slate-800 transition-colors">Advanced / Expert</Link>
                  </div>
                </div>
              </div>
            </nav>

            {/* SEARCH BUTTON */}
            <div className="flex items-center gap-3">
              <NavbarSearchButton />
            </div>

          </div>
        </header>

        <CommandPalette posts={searchData} />
        {children}

        {/* FOOTER ĐẦY ĐỦ LINK CHO GOOGLE ADSENSE */}
        <footer className="border-t border-slate-900 bg-slate-950 py-10 mt-20">
          <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">

            {/* Bản quyền */}
            <div className="text-xs text-slate-500">
              <p>© {new Date().getFullYear()} QAHacks.com. All rights reserved.</p>
              <p className="text-[10px] text-slate-600 mt-1">High-Yield Software Testing Engineering Handbooks.</p>
            </div>

            {/* Cây liên kết Điều khoản (Trust signals dành cho AdSense Bot cào dữ liệu) */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
              <Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link>
              <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
              <Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link>
            </div>

          </div>
        </footer>

        <GoogleAnalytics gaId="G-Z9ZQWLQN2X" />
      </body>
    </html>
  );
}