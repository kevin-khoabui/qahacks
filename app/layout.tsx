import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

// 1. IMPORT CÁC THÀNH PHẦN TÌM KIẾM
import { getAllPosts } from "@/lib/posts";
import CommandPalette from "@/components/CommandPalette";
import NavbarSearchButton from "@/components/NavbarSearchButton"; // <-- THÊM DÒNG NÀY


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QAHacks | Ultimate QA Interview Hub",
  description: "Production-grade QA interview questions, code challenges, and mega compilations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 2. LẤY DỮ LIỆU TÌM KIẾM RÚT GỌN (Giúp hệ thống load cực nhanh)
  const allPosts = getAllPosts();
  const searchData = allPosts.map(post => ({
    slug: post.slug,
    title: post.title,
    category: post.category || "General",
    tool: (post as any).tool_stack || "None"
  }));

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}>
        
        {/* THANH ĐIỀU HƯỚNG CỐ ĐỊNH (STICKY NAVBAR) */}
        <header className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
            
            {/* LOGO TRÁI: Phong cách Minimalist White Line-art */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 group-hover:border-emerald-500/50 transition-colors">
                <svg className="h-5 w-5 text-white group-hover:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                QA<span className="text-emerald-400">Hacks</span>
              </span>
            </Link>

            {/* HỆ THỐNG MENU CHÍNH CHUYÊN NGHIỆP */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
              <Link href="/" className="hover:text-emerald-400 transition-colors">
                Dashboard
              </Link>
              
              {/* MENU BỘ ĐỀ TỔNG HỢP: Nổi bật với màu Amber vàng */}
              <Link href="/?type=Compilation" className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors">
                <span className="text-xs">⭐</span> Compilations
              </Link>

              {/* DROPDOWN MENU 1: Foundations */}
              <div className="relative group py-2">
                <button className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer">
                  Foundations
                  <svg className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:rotate-180 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {/* Khối thả xuống khi Hover */}
                <div className="absolute left-0 top-full pt-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl">
                    <Link href="/?category=Foundations&sub=Manual" className="block px-3 py-2 text-xs rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors">
                      Manual Testing
                    </Link>
                    <Link href="/?category=Foundations&sub=Methodology" className="block px-3 py-2 text-xs rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors">
                      Methodology & SDLC
                    </Link>
                    <Link href="/?category=Foundations&sub=Strategy" className="block px-3 py-2 text-xs rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors">
                      Test Strategy & Planning
                    </Link>
                  </div>
                </div>
              </div>

              {/* DROPDOWN MENU 2: Technical */}
              <div className="relative group py-2">
                <button className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer">
                  Technical
                  <svg className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:rotate-180 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {/* Khối thả xuống khi Hover */}
                <div className="absolute left-0 top-full pt-2 w-56 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl">
                    <Link href="/?sub=Automation" className="block px-3 py-2 text-xs rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors">
                      Automation Testing (UI)
                    </Link>
                    <Link href="/?sub=API" className="block px-3 py-2 text-xs rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors">
                      API Testing & Verification
                    </Link>
                    <Link href="/?sub=Database" className="block px-3 py-2 text-xs rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors">
                      Database & SQL Validation
                    </Link>
                    <Link href="/?sub=Performance" className="block px-3 py-2 text-xs rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors">
                      Performance & Load Testing
                    </Link>
                    <Link href="/?sub=Security" className="block px-3 py-2 text-xs rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors">
                      Security & OWASP Top 10
                    </Link>
                  </div>
                </div>
              </div>

              {/* DROPDOWN MENU 3: TOOLS & FRAMEWORKS */}
              <div className="relative group py-2">
                <button className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer">
                  Tools
                  <svg className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:rotate-180 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 top-full pt-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl">
                    <Link href="/?tool=Playwright" className="block px-3 py-2 text-xs font-medium rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors flex items-center justify-between">
                      Playwright
                    </Link>
                    <Link href="/?tool=Cypress" className="block px-3 py-2 text-xs font-medium rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors flex items-center justify-between">
                      Cypress
                    </Link>
                    <Link href="/?tool=Selenium" className="block px-3 py-2 text-xs font-medium rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors flex items-center justify-between">
                      Selenium
                    </Link>
                    <div className="h-px bg-slate-800 my-1 mx-2"></div> {/* Đường kẻ phân cách nhỏ */}
                    <Link href="/?tool=Postman" className="block px-3 py-2 text-xs font-medium rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors flex items-center justify-between">
                      Postman
                    </Link>
                  </div>
                </div>
              </div>

              <Link href="/?category=Analytical_Behavioral" className="hover:text-emerald-400 transition-colors">
                Behavioral Scenario
              </Link>
            </nav>

            {/* NÚT BÊN PHẢI: Github Link hoặc CTA nhỏ */}
{/*             <div className="flex items-center gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div> */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* NÚT SEARCH TRÊN MENU VỪA TẠO */}
              <NavbarSearchButton />

{/*               <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a> */}
            </div>

          </div>
        </header>

        {/* 3. NHÚNG COMMAND PALETTE VÀO ĐÂY (Nằm ngoài cùng để phủ lên trên mọi thứ) */}
        <CommandPalette posts={searchData} />

        {/* VÙNG CHỨA NỘI DUNG CHÍNH ĐỘNG CỦA CÁC TRANG (PAGE CHILDREN) */}
        {children}

        {/* PHẦN CHÂN TRANG (FOOTER) TỐI GIẢN */}
        <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-20">
          <div className="mx-auto max-w-6xl px-4 text-center text-xs text-slate-600 sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} QAHacks.com. All rights reserved. Designed for QA Leaders and Engineers.</p>
          </div>
        </footer>

      </body>
    </html>
  );
}