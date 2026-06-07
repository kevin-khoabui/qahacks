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
        
        {/* NAVBAR: Thanh điều hướng gọn gàng */}
        <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-extrabold tracking-tight text-white">
              QA<span className="text-emerald-400">Hacks</span>
            </Link>
            <div className="flex gap-6 text-sm font-medium text-slate-400">
              <Link href="/" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
              <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms</Link>
            </div>
          </div>
        </nav>

        {/* NỘI DUNG CHÍNH CỦA CÁC TRANG */}
        <div className="flex-grow">
          {children}
        </div>

        {/* FOOTER: Chân trang bắt buộc cho AdSense */}
        <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
          <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
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