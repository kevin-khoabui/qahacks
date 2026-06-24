"use client"; 

import { useState } from "react";
import Link from "next/link";
import NavbarSearchButton from "./NavbarSearchButton";
import { SITE_CONFIG } from "../lib/config";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);
  const GUMROAD_LINK = SITE_CONFIG.links.gumroadProduct;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group" onClick={closeMenu}>
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 group-hover:border-emerald-500/50 transition-colors p-1">
            <img src="/icon" alt="QA Icon" className="h-full w-full object-contain" />
          </div>
          <span className="text-lg font-black tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-teal-200 transition-all">
            QA<span className="text-white">Hacks</span>
          </span>
        </Link>

        {/* 🖥️ DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-400">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
          
          {/* 🔥 MEGA DROPDOWN - NỔI BẬT CAO ĐỘ (HIGH VISIBILITY) */}
          <div className="relative group py-2">
            <button className="flex items-center gap-1 cursor-pointer px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 font-black transition-all shadow-[0_0_15px_rgba(52,211,153,0.15)] group-hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]">
              Premium Packs ⚡
              <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute left-0 top-full pt-2 w-[360px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-2xl grid grid-cols-2 gap-4">
                
              {/* Manual QA */}
  <div>
    <div className="text-[10px] uppercase font-black tracking-wider text-emerald-400 mb-2 px-1">Manual</div>
    <div className="space-y-1">
      <Link href="/products/manual-junior-50" className="block px-2 py-1 text-[11px] text-slate-300 hover:text-white">Junior (50)</Link>
      <Link href="/products/manual-senior-50" className="block px-2 py-1 text-[11px] text-slate-300 hover:text-white">Senior (50)</Link>
      <Link href="/products/manual-leader-50" className="block px-2 py-1 text-[11px] text-slate-300 hover:text-white">Leader (50)</Link>
    </div>
  </div>

  {/* Automation QA */}
  <div>
    <div className="text-[10px] uppercase font-black tracking-wider text-sky-400 mb-2 px-1">Automation</div>
    <div className="space-y-1">
      <Link href="/products/auto-junior-50" className="block px-2 py-1 text-[11px] text-slate-300 hover:text-white">Junior (50)</Link>
      <Link href="/products/auto-senior-50" className="block px-2 py-1 text-[11px] text-slate-300 hover:text-white">Senior (50)</Link>
      <Link href="/products/auto-leader-50" className="block px-2 py-1 text-[11px] text-slate-300 hover:text-white">Leader (50)</Link>
    </div>
  </div>

  {/* AI Engineering */}
  <div>
    <div className="text-[10px] uppercase font-black tracking-wider text-purple-400 mb-2 px-1">AI Eng</div>
    <div className="space-y-1">
      <Link href="/products/ai-junior-50" className="block px-2 py-1 text-[11px] text-slate-300 hover:text-white">Junior (50)</Link>
      <Link href="/products/ai-senior-50" className="block px-2 py-1 text-[11px] text-slate-300 hover:text-white">Senior (50)</Link>
    </div>
  </div>

              </div>
            </div>
          </div>

          {/* Các Dropdown cũ (Không thay đổi) */}
          <div className="relative group py-2">
            <button className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer">
              Roles & Types
              <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute left-0 top-full pt-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2 py-1">Question Type</div>
                <Link href="/types/Compilation" className="block px-2.5 py-1.5 text-xs rounded-lg text-amber-400 hover:bg-slate-800 transition-colors">⭐ Mega Compilations</Link>
                <Link href="/types/Situational" className="block px-2.5 py-1.5 text-xs rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">Sub-category Cases</Link>
                <div className="h-px bg-slate-800 my-1"></div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2 py-1">Target Roles</div>
                <Link href="/roles/Manual_QA_Engineer" className="block px-2.5 py-1.5 text-xs rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">Manual QA Engineer</Link>
                <Link href="/roles/Automation_QA_Engineer" className="block px-2.5 py-1.5 text-xs rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">Automation QA (SDET)</Link>
                <Link href="/roles/QA_Lead" className="block px-2.5 py-1.5 text-xs rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">QA Lead / Manager</Link>
              </div>
            </div>
          </div>

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

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-2 sm:gap-3">
          <NavbarSearchButton />

          {/* 📱 NÚT HAMBURGER */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-emerald-400 md:hidden transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* 📱 MOBILE DROPDOWN DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-900 bg-slate-950/95 backdrop-blur-lg animate-fadeIn max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="space-y-4 px-4 py-6 text-sm font-semibold text-slate-300">
            
            {/* 🔥 KHỐI SHOP TRÊN MOBILE ĐƯỢC LÀM NỔI BẬT THÀNH 1 CARD RIÊNG */}
            <div className="bg-slate-900/50 border border-emerald-500/20 rounded-xl p-3 mb-4 shadow-[0_0_15px_rgba(52,211,153,0.05)]">
              <div className="text-[11px] uppercase font-black tracking-widest text-emerald-400 mb-3 flex items-center gap-2">
                Premium Packs ⚡
              </div>
              
              {/* Manual QA */}
  <div>
    <div className="text-[10px] uppercase font-black tracking-wider text-emerald-400 mb-2 px-1">Manual</div>
    <div className="space-y-1">
      <Link href="/products/manual-junior-50" className="block px-2 py-1 text-[11px] text-slate-300 hover:text-white">Junior (50)</Link>
      <Link href="/products/manual-senior-50" className="block px-2 py-1 text-[11px] text-slate-300 hover:text-white">Senior (50)</Link>
      <Link href="/products/manual-leader-50" className="block px-2 py-1 text-[11px] text-slate-300 hover:text-white">Leader (50)</Link>
    </div>
  </div>

  {/* Automation QA */}
  <div>
    <div className="text-[10px] uppercase font-black tracking-wider text-sky-400 mb-2 px-1">Automation</div>
    <div className="space-y-1">
      <Link href="/products/auto-junior-50" className="block px-2 py-1 text-[11px] text-slate-300 hover:text-white">Junior (50)</Link>
      <Link href="/products/auto-senior-50" className="block px-2 py-1 text-[11px] text-slate-300 hover:text-white">Senior (50)</Link>
      <Link href="/products/auto-leader-50" className="block px-2 py-1 text-[11px] text-slate-300 hover:text-white">Leader (50)</Link>
    </div>
  </div>

  {/* AI Engineering */}
  <div>
    <div className="text-[10px] uppercase font-black tracking-wider text-purple-400 mb-2 px-1">AI Eng</div>
    <div className="space-y-1">
      <Link href="/products/ai-junior-50" className="block px-2 py-1 text-[11px] text-slate-300 hover:text-white">Junior (50)</Link>
      <Link href="/products/ai-senior-50" className="block px-2 py-1 text-[11px] text-slate-300 hover:text-white">Senior (50)</Link>
    </div>
  </div>
            </div>

            <Link href="/" onClick={closeMenu} className="block text-slate-100 hover:text-emerald-400 py-1 border-b border-slate-900/50">Dashboard</Link>

            {/* Khối 1: Roles & Types */}
            <div className="space-y-1.5">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Roles & Types</div>
              <div className="grid grid-cols-2 gap-2 pl-2">
                <Link href="/types/Compilation" onClick={closeMenu} className="text-amber-400 hover:text-amber-300 text-xs py-1">⭐ Compilations</Link>
                <Link href="/types/Situational" onClick={closeMenu} className="text-slate-400 text-xs py-1">Sub-category Cases</Link>
                <Link href="/roles/Manual_QA_Engineer" onClick={closeMenu} className="text-slate-400 text-xs py-1">Manual Engineer</Link>
                <Link href="/roles/Automation_QA_Engineer" onClick={closeMenu} className="text-slate-400 text-xs py-1">Automation (SDET)</Link>
                <Link href="/roles/QA_Lead" onClick={closeMenu} className="text-slate-400 text-xs py-1">QA Lead / Manager</Link>
              </div>
            </div>

            {/* Khối 2: Foundations */}
            <div className="space-y-1.5">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Foundations & Categories</div>
              <div className="grid grid-cols-2 gap-2 pl-2">
                <Link href="/categories/Analytical_Behavioral" onClick={closeMenu} className="text-slate-400 text-xs py-1">Analytical & Behav</Link>
                <Link href="/categories/Technical" onClick={closeMenu} className="text-slate-400 text-xs py-1">Tech Architecture</Link>
                <Link href="/sub-categories/Strategy" onClick={closeMenu} className="text-slate-400 text-xs py-1">Test Strategy</Link>
                <Link href="/sub-categories/Automation" onClick={closeMenu} className="text-slate-400 text-xs py-1">Auto Execution</Link>
              </div>
            </div>

            {/* Khối 3: Methodologies */}
            <div className="space-y-1.5">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Methodologies & Domains</div>
              <div className="grid grid-cols-2 gap-2 pl-2">
                <Link href="/testing-types/Manual" onClick={closeMenu} className="text-teal-400 text-xs py-1">Manual Exec</Link>
                <Link href="/testing-types/Automation" onClick={closeMenu} className="text-sky-400 text-xs py-1">Auto Scripts</Link>
                <Link href="/domains/Enterprise-Software" onClick={closeMenu} className="text-slate-400 text-xs py-1">Enterprise Soft</Link>
                <Link href="/domains/Banking_Finance" onClick={closeMenu} className="text-slate-400 text-xs py-1">Banking & Fin</Link>
                <Link href="/platforms/Cross-platform" onClick={closeMenu} className="text-slate-400 text-xs py-1">Cross-platform</Link>
                <Link href="/platforms/Web" onClick={closeMenu} className="text-slate-400 text-xs py-1">Web Apps</Link>
              </div>
            </div>

            {/* Khối 4: Tools & Difficulty */}
            <div className="space-y-1.5">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Tools & Difficulties</div>
              <div className="grid grid-cols-2 gap-2 pl-2">
                <Link href="/tools/Playwright" onClick={closeMenu} className="text-slate-400 text-xs py-1">Playwright</Link>
                <Link href="/tools/Cypress" onClick={closeMenu} className="text-slate-400 text-xs py-1">Cypress</Link>
                <Link href="/tools/None" onClick={closeMenu} className="text-slate-400 text-xs py-1">Generic (No Tool)</Link>
                <Link href="/difficulties/Intermediate" onClick={closeMenu} className="text-yellow-500 text-xs py-1">Intermediate</Link>
                <Link href="/difficulties/Advanced" onClick={closeMenu} className="text-rose-500 text-xs py-1">Advanced / Expert</Link>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}