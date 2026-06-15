import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | QA Hacks",
  description: "Get in touch with the QA Hacks team for feedback, support, or partnership inquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Contact Us</h1>
          <p className="mt-2 text-sm text-slate-400">Have a question or feedback? We&apos;d love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-300 text-sm">
          <div className="bg-[#0B1121] p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              General Inquiries
            </h2>
            <p className="text-slate-400 text-xs">
              For general questions regarding our content, practice guides, or technical troubleshooting:
            </p>
            <p className="font-semibold text-emerald-400 select-all">contact@qahacks.com</p>
          </div>

          <div className="bg-[#0B1121] p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
              Connect Privately
            </h2>
            <p className="text-slate-400 text-xs">
              Follow our project updates or message the maintainers directly through professional network channels:
            </p>
            <div className="flex flex-col gap-1 text-xs">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-emerald-400 transition-colors">
                🔗 LinkedIn Portfolio
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-emerald-400 transition-colors">
                🐙 GitHub Repository
              </a>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 text-center pt-8">
          Note: To remain fully static and ultra-secure, we do not utilize any database-driven web contact forms. Please drop an explicit mail to the address above.
        </div>
      </div>
    </main>
  );
}