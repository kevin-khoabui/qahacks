import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/config";
import { getNavbarData } from "@/lib/posts";
import Navbar from "@/components/Navbar";
import CommandPalette from "@/components/CommandPalette";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QAHacks | Ultimate QA Interview Hub & Automation Handbook",
  description:
    "Master software automation testing with production-grade QA interview questions, advanced code challenges, framework best practices, and mega compilations.",
  metadataBase: new URL("https://qahacks.com"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuData = await getNavbarData().catch(() => ({
    categories: [],
    roles: [],
    tools: [],
    companies: [],
  }));

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}>
        <Navbar menuData={menuData} />

        <CommandPalette />

        {children}

        <footer className="border-t border-slate-900 bg-slate-950 py-10 mt-20">
          <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <div className="text-xs text-slate-500">
              <p>© {new Date().getFullYear()} QAHacks.com. All rights reserved.</p>
              <p className="text-[10px] text-slate-600 mt-1">
                High-Yield Software Testing Engineering Handbooks.
              </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
              <a
                href={SITE_CONFIG.links.substack}
                target="_blank"
                rel="noopener noreferrer"
                //className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
                className="px-3 py-1.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/10 transition-all"

              >
                Premium Pack 🔥
              </a>

              <a
                href={SITE_CONFIG.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 font-bold hover:text-sky-300 transition-colors"
              >
                LinkedIn
              </a>

              <Link href="/about" className="hover:text-emerald-400 transition-colors">
                About Us
              </Link>
              <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-emerald-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </footer>

        <GoogleAnalytics gaId="G-Z9ZQWLQN2X" />
      </body>
    </html>
  );
}