import HomePageClient from "./HomePageClient";
import { SITE_CONFIG } from "@/lib/config";

// export const runtime = 'edge';

export const metadata = {
  title: "QA Hacks | Master Software Testing & Interview Guides",
  description: "Comprehensive QA interview questions, automation testing tutorials, and career blueprints for Manual, Automation, and QA Lead positions.",
  keywords: [
    "QA interview", "software testing", "automation testing", "Cypress", "Playwright", "QA Hacks",
    "software engineer", "developer testing", "QA Lead interview", "test automation engineer"
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "QA Hacks",
            "url": "https://qahacks.com/",
            "description": "Master software testing and ace your QA interviews with our expert blueprints."
          }),
        }}
      />
      
      {/* NỘI DUNG CHÍNH CỦA TRANG CHỦ */}
      <HomePageClient />

      {/* KHỐI CTA SUBSTACK - ĐẶT Ở CUỐI TRANG */}
      <div className="bg-slate-950 pb-16 px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 to-[#0B1121] border border-emerald-500/20 p-8 sm:p-16 text-center max-w-5xl mx-auto shadow-2xl">
          {/* Lớp ánh sáng mờ trang trí nền */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>

          <div className="relative z-10">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-6 border border-emerald-500/20">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg> {/* ĐÃ THÊM THẺ ĐÓNG Ở ĐÂY */}
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
              Level up your Tech & Engineering Career 🚀
            </h2>
            
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base mb-8 leading-relaxed">
              Get weekly advanced automation strategies, exclusive tech interview breakdowns, and real-world engineering leadership case studies directly in your inbox.
            </p>
            
            <a
              href={SITE_CONFIG.links.substack}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 text-slate-950 font-black text-base hover:bg-emerald-400 transition-all hover:scale-105 shadow-[0_0_30px_rgba(52,211,153,0.3)]"
            >
              Subscribe to Newsletter 📩
            </a>
            
            <p className="mt-6 text-[11px] font-medium text-slate-500 uppercase tracking-widest">
              Join other elite tech professionals on Substack
            </p>
          </div>
        </section>
      </div>
    </>
  );
}