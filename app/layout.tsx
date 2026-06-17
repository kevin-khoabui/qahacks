import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { getAllPosts } from "@/lib/posts";
import CommandPalette from "@/components/CommandPalette";
import Navbar from "@/components/Navbar"; // 🔥 IMPORT NAVBAR CLIENT COMPONENT MỚI
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

        {/* 🔥 GỌI COMPONENT NAVBAR ĐÃ TÍCH HỢP MOBILE MENU TẠI ĐÂY */}
        <Navbar />

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
            {/* Cây liên kết Điều khoản */}
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