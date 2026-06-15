import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | QA Hacks",
  description: "Terms of Service and conditions for using the QA Hacks platform.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Terms of Service</h1>
          <p className="mt-2 text-xs text-slate-400">Last updated: June 15, 2026</p>
        </div>

        <div className="space-y-6 text-slate-300 leading-relaxed text-xs">
          <h2 className="text-lg font-bold text-white">1. Terms</h2>
          <p>
            By accessing the website at <a href="https://qahacks.com" className="text-emerald-400">https://qahacks.com</a>, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>

          <h2 className="text-lg font-bold text-white pt-2">2. Use License</h2>
          <p>
            Permission is granted to temporarily view the materials (information or software) on QA Hacks&apos; website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials, use the materials for any commercial purpose, or attempt to decompile any software contained on the website.
          </p>

          <h2 className="text-lg font-bold text-white pt-2">3. Disclaimer</h2>
          <p>
            The materials on QA Hacks&apos; website are provided on an &apos;as is&apos; basis. QA Hacks makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2 className="text-lg font-bold text-white pt-2">4. Limitations</h2>
          <p>
            In no event shall QA Hacks or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on QA Hacks&apos; website.
          </p>

          <h2 className="text-lg font-bold text-white pt-2">5. Accuracy of Materials</h2>
          <p>
            The materials appearing on QA Hacks&apos; website could include technical, typographical, or photographic errors. QA Hacks does not warrant that any of the materials on its website are accurate, complete or current. QA Hacks may make changes to the materials contained on its website at any time without notice.
          </p>
        </div>
      </article>
    </main>
  );
}