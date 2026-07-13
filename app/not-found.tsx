import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-slate-950 flex items-center justify-center px-4">
      <section className="max-w-2xl text-center rounded-3xl border border-slate-800 bg-[#0B1121] px-6 py-12 sm:px-10 shadow-2xl">
        <div className="inline-flex items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-6">
          Page moved
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-5">
          This page is no longer available
        </h1>

        <p className="mx-auto max-w-lg text-sm sm:text-base leading-relaxed text-slate-400">
          The guide you are looking for may have been updated, renamed, or moved to a better location in the QAHacks library.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-slate-950 hover:bg-emerald-400 transition-all"
          >
            Explore QA Hacks Library
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-bold text-slate-200 hover:border-emerald-500/40 hover:text-emerald-400 transition-all"
          >
            View Premium Packs
          </Link>
        </div>
      </section>
    </main>
  );
}