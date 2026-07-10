import Link from "next/link";
import { INTERVIEW_COLLECTIONS } from "@/lib/collections";

export default function FeaturedCollections() {
  const featuredCollections = INTERVIEW_COLLECTIONS.slice(0, 8);

  return (
    <section className="mt-12">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Start Here
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
            Interview Collections
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Pick the path closest to your next interview. Each collection groups the most relevant questions by role, tool, or interview focus.
          </p>
        </div>

        <Link
          href="/collections"
          className="text-sm font-bold text-emerald-400 hover:text-emerald-300"
        >
          View all collections →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featuredCollections.map((collection) => (
          <Link
            key={collection.slug}
            href={collection.href}
            className="group rounded-2xl border border-slate-800 bg-[#0B1121] p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-500/50 hover:bg-slate-900"
          >
            <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              {collection.badge}
            </span>

            <h3 className="mt-4 text-base font-black text-white group-hover:text-emerald-400">
              {collection.title}
            </h3>

            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400">
              {collection.description}
            </p>

            <div className="mt-4 text-xs font-bold text-emerald-400">
              Open collection →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}