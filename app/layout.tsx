import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QAHacks - Software Testing Interview Questions",
  description: "Master your QA interviews with production-grade automation scenarios, API testing, and expert solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-100 flex flex-col min-h-screen`}>
        
        {/* NAVBAR NÂNG CẤP: Nhiều Menu & Phân loại chuyên sâu */}
        <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              
              {/* Logo bên trái */}
              <div className="flex items-center gap-8">
                <Link href="/" className="text-xl font-extrabold tracking-tight text-white shrink-0">
                  QA<span className="text-emerald-400">Hacks</span>
                </Link>
                
                {/* Hệ thống Menu chính (Ẩn trên điện thoại nhỏ, hiện trên máy tính) */}
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
                  <Link href="/" className="hover:text-emerald-400 transition-colors text-white">Dashboard</Link>
                  
                  {/* Cụm Menu 1: Foundations */}
                  <div className="relative group py-2">
                    <button className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer">
                      Foundations
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {/* Dropdown Menu hiện ra khi rê chuột vào */}
                    <div className="absolute left-0 top-full pt-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-xl">
                        <Link href="/?category=Foundations&sub=Manual" className="block px-4 py-2 text-xs rounded-lg hover:bg-slate-800 hover:text-emerald-400">Manual Testing</Link>
                        <Link href="/?category=Foundations&sub=Methodology" className="block px-4 py-2 text-xs rounded-lg hover:bg-slate-800 hover:text-emerald-400">Methodology & SDLC</Link>
                        <Link href="/?category=Foundations&sub=Strategy" className="block px-4 py-2 text-xs rounded-lg hover:bg-slate-800 hover:text-emerald-400">Test Strategy & Planning</Link>
                      </div>
                    </div>
                  </div>

                  {/* Cụm Menu 2: Technical */}
                  <div className="relative group py-2">
                    <button className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer">
                      Technical
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className="absolute left-0 top-full pt-2 w-52 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-xl">
                        <Link href="/?sub=Automation" className="block px-4 py-2 text-xs rounded-lg hover:bg-slate-800 hover:text-emerald-400">Automation Testing</Link>
                        <Link href="/?sub=API" className="block px-4 py-2 text-xs rounded-lg hover:bg-slate-800 hover:text-emerald-400">API Testing</Link>
                        <Link href="/?sub=Database" className="block px-4 py-2 text-xs rounded-lg hover:bg-slate-800 hover:text-emerald-400">Database & SQL Validation</Link>
                        <Link href="/?sub=Performance" className="block px-4 py-2 text-xs rounded-lg hover:bg-slate-800 hover:text-emerald-400">Performance (Load/Stress)</Link>
                        <Link href="/?sub=Security" className="block px-4 py-2 text-xs rounded-lg hover:bg-slate-800 hover:text-emerald-400">Security & OWASP Top 10</Link>
                      </div>
                    </div>
                  </div>

                  {/* Menu Đơn */}
                  <Link href="/?category=Analytical_Behavioral" className="hover:text-emerald-400 transition-colors">Behavioral Scenario</Link>
                </div>
              </div>

              {/* Nhóm liên kết phụ bên phải */}
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                <Link href="/privacy" className="hover:text-slate-300 transition-colors hidden sm:block">Privacy</Link>
                <Link href="/terms" className="hover:text-slate-300 transition-colors hidden sm:block">Terms</Link>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/50 px-2.5 py-1 rounded-md font-semibold tracking-wide">
                  PRO MODE
                </span>
              </div>

            </div>
          </div>
        </nav>

        {/* NỘI DUNG CHÍNH CỦA CÁC TRANG */}
        <div className="flex-grow">
          {children}
        </div>

        {/* FOOTER */}
        <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} QAHacks.com. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
              <Link href="/terms" className="hover:underline">Terms of Service</Link>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}