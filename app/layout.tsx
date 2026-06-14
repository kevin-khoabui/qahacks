import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

//1. IMPORT CÁC THÀNH PHẦN TÌM KIẾM VÀ GOOGLE ANALYTICS
import { getAllPosts } from "@/lib/posts";
import CommandPalette from "@/components/CommandPalette";
import NavbarSearchButton from "@/components/NavbarSearchButton";
import { GoogleAnalytics } from "@next/third-parties/google"; // Nhúng thư viện GA4 chính chủ của Next.js

const inter = Inter({ subsets: ["latin"] });

// ==================== GLOBAL SEO & METADATA CONFIGURATION (100% ENGLISH) ====================
export const metadata: Metadata = {
  title: {
    default: "QAHacks | Ultimate QA Interview Hub & Automation Handbook",
    template: "%s | QAHacks" // Tự động chèn tên bài viết vào sau, ví dụ: "Playwright Advanced | QAHacks"
  },
  description: "Master software automation testing with production-grade QA interview questions, advanced code challenges, framework best practices, and mega compilations for Playwright, Cypress, and CI/CD pipelines.",
  keywords: [
    "automation testing", 
    "QA interview questions", 
    "QAHacks", 
    "playwright tutorial", 
    "cypress frameworks", 
    "selenium testing", 
    "software engineering in test", 
    "SDET interview guide",
    "CI/CD pipeline test automation"
  ],
  authors: [{ name: "QAHacks Team" }],
  creator: "QAHacks",
  metadataBase: new URL("https://qahacks.com"), // Điền domain chính thức của bạn vào đây

  // Open Graph Tags (Hiển thị khi share lên LinkedIn, Facebook, Slack, Discord...)
  openGraph: {
    title: "QAHacks | Ultimate QA Interview Hub & Automation Handbook",
    description: "Production-grade QA interview questions, advanced code challenges, and framework best practices for Playwright, Cypress, and CI/CD pipelines.",
    url: "https://qahacks.com",
    siteName: "QAHacks",
    images: [
      {
        url: "/og-image.png", // Bạn thiết kế 1 ảnh banner 1200x630 ném vào thư mục public đặt tên là og-image.png nhé
        width: 1200,
        height: 630,
        alt: "QAHacks - Ultimate QA Interview Hub Banner Preview",
      },
    ],
    locale: "en_US", // Chuẩn hóa tiếng Anh toàn cầu
    type: "website",
  },

  // Twitter / X Cards Cấu hình hiển thị trên X
  twitter: {
    card: "summary_large_image",
    title: "QAHacks | Ultimate QA Interview Hub",
    description: "Production-grade QA interview questions, advanced code challenges, and framework best practices.",
    images: ["/og-image.png"],
  },
  
  // Điều hướng Bot tìm kiếm (Googlebot, Bingbot...) cào dữ liệu
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
// ============================================================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 2. LẤY DỮ LIỆU TÌM KIẾM RÚT GỌN (Giúp hệ thống load cực nhanh)
  const allPosts = getAllPosts();
  
  // 🚀 FIX LỖI 3: Chuẩn hóa trường category từ dạng Mảng sang dạng Chuỗi sạch để khớp kiểu dữ liệu với SearchPost
  const searchData = allPosts.map(post => {
    // Ép kiểu an toàn để bốc phần tử đầu tiên nếu category trả về mảng dữ liệu tĩnh
    const rawCategory = post.category;
    const cleanCategoryString = Array.isArray(rawCategory)
      ? (rawCategory[0] || "General")
      : (rawCategory || "General");

    return {
      slug: post.slug,
      title: post.title,
      // Tiến hành gọt sạch dấu gạch dưới toàn cục để hiển thị chữ siêu sạch trên ô tìm kiếm nhanh
      category: cleanCategoryString.replace(/_/g, " "),
      tool: (post as any).tool_stack || "None"
    };
  });

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}>
        
        {/* THANH ĐIỀU HƯỚNG CỐ ĐỊNH (STICKY NAVBAR) */}
        <header className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
            
            {/* LOGO TRÁI: Đã đồng bộ bằng cách gọi Favicon Code và Đổ màu Gradient Text */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 group-hover:border-emerald-500/50 transition-colors p-1">
                <img 
                  src="/icon" 
                  alt="QA Icon" 
                  className="h-full w-full object-contain"
                />
              </div>

              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-teal-200 transition-all">
                QA<span className="text-white">Hacks</span>
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
                    <div className="h-px bg-slate-800 my-1 mx-2"></div>
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

            {/* KHU VỰC NÚT TÌM KIẾM BÊN PHẢI */}
            <div className="flex items-center gap-3 sm:gap-4">
              <NavbarSearchButton />
            </div>

          </div>
        </header>

        {/* 3. NHÚNG COMMAND PALETTE VÀO ĐÂY */}
        <CommandPalette posts={searchData} />

        {/* VÙNG CHỨA NỘI DUNG CHÍNH ĐỘNG CỦA CÁC TRANG (PAGE CHILDREN) */}
        {children}

        {/* PHẦN CHÂN TRANG (FOOTER) TỐI GIẢN */}
        <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-20">
          <div className="mx-auto max-w-6xl px-4 text-center text-xs text-slate-600 sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} QAHacks.com. All rights reserved. Designed for QA Leaders and Engineers.</p>
          </div>
        </footer>

        {/* 4. KÍCH HOẠT MẮT THẦN GOOGLE ANALYTICS VỚI ID CỦA BẠN */}
        <GoogleAnalytics gaId="G-Z9ZQWLQN2X" />

      </body>
    </html>
  );
}