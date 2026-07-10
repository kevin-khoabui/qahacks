"use client";

import { useState } from "react";
import Link from "next/link";
import NavbarSearchButton from "./NavbarSearchButton";
import { SITE_CONFIG } from "@/lib/config";

interface MenuData {
  categories: string[];
  roles: string[];
  tools: string[];
  companies?: string[];
}

type MobileSection = "topics" | "roles" | "tools" | "companies" | null;

// Hàm định dạng tên chỉ dùng cho Companies
function formatLabel(value: string) {
  const labelMap: Record<string, string> = {
    'FAANG_DSA': 'Google / Meta',
    'Amazon_Microsoft': 'Amazon / Microsoft',
    'Startup_General': 'Startup & Agency'
  };
  return labelMap[value] || value.replace(/_/g, " ");
}

export default function Navbar({ menuData }: { menuData?: MenuData }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<MobileSection>(null);

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
    setOpenMobileSection(null);
  }

  function toggleMobileSection(section: MobileSection) {
    setOpenMobileSection((current) => (current === section ? null : section));
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-emerald-500/10 text-emerald-400 font-black text-sm group-hover:border-emerald-500/50 transition-colors">
            QA
          </div>
          <span className="text-lg font-black tracking-tight bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            QA<span className="text-white">Hacks</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
          <Link href="/" className="hover:text-emerald-400 transition-colors">
            Dashboard
          </Link>

          {/* Categories */}
          <div className="relative group py-2">
            <button className="hover:text-emerald-400 transition-colors">
              Collections
            </button>
            <div className="absolute left-0 top-full pt-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl">
                {(menuData?.categories || []).map((cat) => (
                  <Link
                    key={cat}
                    href={`/categories/${cat}`}
                    className="block px-3 py-2 text-xs rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
                  >
                    {cat.replace(/_/g, " ")}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Roles */}
          <div className="relative group py-2">
            <button className="hover:text-emerald-400 transition-colors">
              Roles
            </button>
            <div className="absolute left-0 top-full pt-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl">
                {(menuData?.roles || []).map((role) => (
                  <Link
                    key={role}
                    href={`/roles/${role}`}
                    className="block px-3 py-2 text-xs rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
                  >
                    {role.replace(/_/g, " ")}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Tools */}
          <div className="relative group py-2">
            <button className="hover:text-emerald-400 transition-colors flex items-center gap-1">
              Tools
            </button>
            <div className="absolute left-0 top-full pt-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl">
                {(menuData?.tools || []).map((tool) => (
                  <Link
                    key={tool}
                    href={`/tools/${tool}`}
                    className="block px-3 py-2 text-xs rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
                  >
                    {tool}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Companies */}
          <div className="relative group py-2">
            <button className="hover:text-emerald-400 transition-colors flex items-center gap-1">
              Companies
            </button>
            <div className="absolute left-0 top-full pt-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl">
                {(menuData?.companies || []).map((company) => (
                  <Link
                    key={company}
                    href={`/companies/${company}`}
                    className="block px-3 py-2 text-xs rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
                  >
                    {formatLabel(company)}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-2">
            {/* Nút Newsletter dẫn sang Substack */}
            <a

              href={SITE_CONFIG.links.substack}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/10 transition-all"
            >
              Premium Pack 🔥
            </a>

         {/*    <Link
              href="/products"
              className="px-3 py-1.5 text-[11px] font-black text-slate-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-all"
            >
              Premium Pack 🔥
            </Link> */}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <NavbarSearchButton />

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen((value) => !value);
              setOpenMobileSection(null);
            }}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
          >
            {isMobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Accordion */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-900 bg-slate-950/95 backdrop-blur-md max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain">
          <nav className="mx-auto max-w-6xl px-4 py-4 pb-8 sm:px-6 lg:px-8">
            <div className="space-y-3">
              <Link href="/" onClick={closeMobileMenu} className="block rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm font-bold text-slate-200 hover:border-emerald-500/40 hover:text-emerald-400">
                Dashboard
              </Link>

              {/* Nút Newsletter Mobile */}
              <a
                href="https://qahacks.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobileMenu}
               className="block rounded-xl bg-amber-400 px-4 py-3 text-sm font-black text-slate-950 hover:bg-amber-300"
              >
               Premium Pack 🔥
              </a>

              <Link href="/products" onClick={closeMobileMenu} className="block rounded-xl bg-amber-400 px-4 py-3 text-sm font-black text-slate-950 hover:bg-amber-300">
                Premium Pack 🔥
              </Link>

              {/* Topics Mobile */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
                <button type="button" onClick={() => toggleMobileSection("topics")} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold text-slate-200 hover:text-emerald-400">
                  <span>Topics</span>
                  <span className={`transition-transform ${openMobileSection === "topics" ? "rotate-180" : ""}`}>▼</span>
                </button>
                {openMobileSection === "topics" && (
                  <div className="border-t border-slate-800 px-2 py-2">
                    {(menuData?.categories || []).map((cat) => (
                      <Link key={cat} href={`/categories/${cat}`} onClick={closeMobileMenu} className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-emerald-400">
                        {cat.replace(/_/g, " ")}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Roles Mobile */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
                <button type="button" onClick={() => toggleMobileSection("roles")} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold text-slate-200 hover:text-emerald-400">
                  <span>Roles</span>
                  <span className={`transition-transform ${openMobileSection === "roles" ? "rotate-180" : ""}`}>▼</span>
                </button>
                {openMobileSection === "roles" && (
                  <div className="border-t border-slate-800 px-2 py-2">
                    {(menuData?.roles || []).map((role) => (
                      <Link key={role} href={`/roles/${role}`} onClick={closeMobileMenu} className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-emerald-400">
                        {role.replace(/_/g, " ")}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Tools Mobile */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
                <button type="button" onClick={() => toggleMobileSection("tools")} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold text-slate-200 hover:text-emerald-400">
                  <span>Tools</span>
                  <span className={`transition-transform ${openMobileSection === "tools" ? "rotate-180" : ""}`}>▼</span>
                </button>
                {openMobileSection === "tools" && (
                  <div className="border-t border-slate-800 px-2 py-2">
                    {(menuData?.tools || []).map((tool) => (
                      <Link key={tool} href={`/tools/${tool}`} onClick={closeMobileMenu} className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-emerald-400">
                        {tool}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Companies Mobile */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
                <button type="button" onClick={() => toggleMobileSection("companies")} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold text-slate-200 hover:text-emerald-400">
                  <span>Companies</span>
                  <span className={`transition-transform ${openMobileSection === "companies" ? "rotate-180" : ""}`}>▼</span>
                </button>
                {openMobileSection === "companies" && (
                  <div className="border-t border-slate-800 px-2 py-2">
                    {(menuData?.companies || []).map((company) => (
                      <Link key={company} href={`/companies/${company}`} onClick={closeMobileMenu} className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-emerald-400">
                        {formatLabel(company)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </nav>
        </div>
      )}
    </header>
  );
}