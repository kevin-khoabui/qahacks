'use client';

import { Search } from 'lucide-react';

export default function NavbarSearchButton() {
  const openCommandPalette = () => {
    window.dispatchEvent(new Event('open-command-palette'));
  };

  return (
    <button
      onClick={openCommandPalette}
      className="group flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-400 bg-slate-900/50 border border-slate-800 rounded-lg hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer select-none"
      aria-label="Search"
    >
      <Search className="w-4 h-4 group-hover:animate-pulse" />
      <span className="hidden sm:inline-block">Search</span>
      <kbd className="hidden sm:inline-block text-[10px] font-sans font-semibold bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-500 group-hover:border-emerald-500/30 transition-colors ml-1">
        Ctrl K / ⌘K
      </kbd>
    </button>
  );
}