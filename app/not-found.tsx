"use client";

import Link from "next/link";

// Trang này là tĩnh hoàn toàn, không cần server logic
// export const runtime = 'edge';
// export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-slate-950 flex flex-col items-center justify-center text-center px-4">
      <div className="space-y-5">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-2xl font-bold animate-pulse">
          ⚠️
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          404 - Page Not Found
        </h1>

        <p className="text-slate-400 max-w-md mx-auto text-sm sm:text-base">
          The interview handbook or automation tutorial you are looking for might have been moved, renamed, or is temporarily unavailable.
        </p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-sm font-semibold text-slate-950 hover:opacity-90 transition-all shadow-lg shadow-emerald-500/10"
          >
            Back to Dashboard Hub
          </Link>
        </div>
      </div>
    </main>
  );
}