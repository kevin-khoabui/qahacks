"use client";

import { useState } from "react";
import Link from "next/link";
import NavbarSearchButton from "./NavbarSearchButton";
import { SITE_CONFIG } from "../lib/config";

interface MenuData {
  categories: string[];
  roles: string[];
  tools: string[];
}

export default function Navbar({ menuData }: { menuData?: MenuData }) {
  const GUMROAD_LINK = SITE_CONFIG.links.gumroadProduct;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-emerald-500/10 text-emerald-400 font-black text-sm group-hover:border-emerald-500/50 transition-colors">
            QA
          </div>
          <span className="text-lg font-black tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            QA<span className="text-white">Hacks</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Dashboard</Link>

          {/* Categories */}
          <div className="relative group py-2">
            <button className="hover:text-emerald-400 transition-colors">Categories</button>
            <div className="absolute left-0 top-full pt-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl">
                {(menuData?.categories || []).map((cat) => (
                  <Link key={cat} href={`/categories/${cat}`} className="block px-3 py-2 text-xs rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400">
                    {cat.replace(/_/g, " ")}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Roles */}
          <div className="relative group py-2">
            <button className="hover:text-emerald-400 transition-colors">Roles</button>
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
            <button className="hover:text-emerald-400 transition-colors flex items-center gap-1">Tools</button>
            <div className="absolute left-0 top-full pt-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl">
                {(menuData?.tools || []).map((tool) => (
                  <Link key={tool} href={`/tools/${tool}`} className="block px-3 py-2 text-xs rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400">
                    {tool}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <a href={GUMROAD_LINK} target="_blank" className="px-3 py-1.5 text-[11px] font-black text-slate-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-all">Premium Pack 🔥</a>
        </nav>

        <div className="flex items-center gap-3">
          <NavbarSearchButton />
        </div>
      </div>
    </header>
  );
}