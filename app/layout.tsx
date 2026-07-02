import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/config";
//import { getAllPosts, getNavbarData } from "@/lib/posts";
import { getNavbarData } from "@/lib/posts";
import CommandPalette from "../components/CommandPalette";
import Navbar from "@/components/Navbar"; 
import { GoogleAnalytics } from "@next/third-parties/google";
//export const dynamic = "force-dynamic";

// BẮT BUỘC: Chạy trên Cloudflare Edge
//export const runtime = 'edge';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QAHacks | Ultimate QA Interview Hub & Automation Handbook",
  description: "Master software automation testing with production-grade QA interview questions, advanced code challenges, framework best practices, and mega compilations.",
  metadataBase: new URL("https://qahacks.com"),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  
  // 1. Fetch dữ liệu bài viết cho Search (CommandPalette)
/*   const allPosts = await getAllPosts();
  const searchData = Array.isArray(allPosts) ? allPosts.map(post => {
    const rawCategory = post.category;
    const cleanCategoryString = Array.isArray(rawCategory) ? (rawCategory[0] || "General") : (rawCategory || "General");
    return {
      slug: post.slug,
      title: post.title,
      category: cleanCategoryString.replace(/_/g, " "),
      tool: (post as any).tool_stack || "None"
    };
  }) : []; */

  // 2. Fetch dữ liệu phân loại cho Navbar (Dynamic Data)
  // Catch lỗi để nếu DB có vấn đề thì Navbar vẫn không bị crash
  const menuData = await getNavbarData().catch(() => ({ 
    categories: [], 
    roles: [], 
    tools: [],
    companies: []
  }));

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}>

        {/* Truyền dữ liệu menu động vào Navbar */}
        <Navbar menuData={menuData} />

   {/*      <CommandPalette posts={searchData} /> */}
   <CommandPalette posts={[]} />
        
        {children}

        <footer className="border-t border-slate-900 bg-slate-950 py-10 mt-20">
          <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <div className="text-xs text-slate-500">
              <p>© {new Date().getFullYear()} QAHacks.com. All rights reserved.</p>
              <p className="text-[10px] text-slate-600 mt-1">High-Yield Software Testing Engineering Handbooks.</p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
              
              {/* THÊM LINK NEWSLETTER VÀ LINKEDIN NỔI BẬT */}
              <a href={SITE_CONFIG.links.substack} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors">
                Newsletter 📩
              </a>
              <a href={SITE_CONFIG.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-sky-400 font-bold hover:text-sky-300 transition-colors">
                LinkedIn
              </a>

              {/* CÁC LINK THÔNG TIN */}
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