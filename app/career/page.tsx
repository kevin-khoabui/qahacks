// app/career/page.tsx

import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Career Network | QA Hacks",
  description:
    "Join the QA Hacks Career Network for QA, Software Engineering, remote roles, relocation-supported jobs, and visa sponsorship opportunities.",
};

export default function CareerPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-400">
            QA Hacks Career Network
          </p>

          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
            Join the QA Hacks Career Network
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Connect with companies hiring QA Engineers, SDETs, Software Engineers,
            AI Software Engineers, and technical leaders worldwide. Some roles may
            support remote work, relocation, or visa sponsorship depending on the
            hiring company and position.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              "🌍 Global Talent",
              "💼 Remote Roles",
              "🛂 Visa Sponsorship",
              "🤝 Human Review",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunity Support */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-500/20 bg-slate-900/70 p-8 shadow-xl">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-400">
            Opportunity Support
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
            Remote Work, Relocation & Visa Sponsorship May Be Available
          </h2>

          <p className="mt-5 text-sm leading-relaxed text-slate-400 sm:text-base">
            Some roles may offer remote work, relocation support, or visa
            sponsorship. Availability depends on the specific role, hiring company,
            country requirements, and candidate profile.
          </p>
        </div>
      </section>

      {/* Interview Process */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-400">
              Interview Process
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              A Clear 3-Round Hiring Process
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-slate-400 sm:text-base">
              If you pass the assignment round, we aim to complete the remaining
              interviews within 2 weeks to reduce waiting time and support visa
              sponsorship timelines when applicable.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              {
                round: "Round 1",
                title: "Take-Home Assignment",
                time: "72 Hours",
                text: "Complete real-world scenario questions independently from home.",
              },
              {
                round: "Round 2",
                title: "Technical Interview",
                time: "60 Minutes",
                text: "Meet with a Technical Engineer or Senior Engineer to discuss your assignment, experience, and practical decision-making.",
              },
              {
                round: "Round 3",
                title: "CEO / Manager Interview",
                time: "30 Minutes",
                text: "Discuss behavior, communication, salary, availability, and next steps.",
              },
            ].map((item, index) => (
              <div
                key={item.round}
                className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-300">
                    {item.round}
                  </span>

                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-slate-400">
                    {item.time}
                  </span>
                </div>

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-lg font-black text-slate-950">
                  {index + 1}
                </div>

                <h3 className="text-xl font-black text-white">{item.title}</h3>

                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <h3 className="text-lg font-black text-emerald-300">
              Fast-track after Round 1
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Candidates who pass the assignment will move to the technical
              interview round. We aim to complete Round 2 and Round 3 within a
              maximum of 2 weeks whenever possible.
            </p>
          </div>
        </div>
      </section>

      {/* Screening */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-500/20 bg-slate-900/70 p-8 shadow-xl">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-400">
            Screening Process
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
            Real-World Scenario Assessment
          </h2>

          <p className="mt-5 text-sm leading-relaxed text-slate-400 sm:text-base">
            Selected candidates may receive practical scenario questions to
            complete within 72 hours. This assessment helps us understand your
            real thinking, communication style, and problem-solving approach.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm font-bold text-white">Important:</p>

            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Please complete the assessment independently. Do not use AI tools to
              generate your answers.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-4xl border border-emerald-500/20 bg-slate-900/70 p-3 shadow-2xl sm:p-6">
          <iframe
            data-tally-src="https://tally.so/embed/OD9D27?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            loading="lazy"
            width="100%"
            height="500"
            frameBorder="0"
            title="QA Hacks Career Network Form"
          />
        </div>

        <Script
          src="https://tally.so/widgets/embed.js"
          strategy="afterInteractive"
        />
      </section>

      {/* Trust */}
      <section className="px-4 py-10 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-emerald-500/20 bg-slate-900/70 p-8 shadow-xl">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-400">
              Why Candidates Trust QA Hacks
            </p>

            <h2 className="mt-4 text-3xl font-black text-white">
              Human Review. Clear Process. Responsible Data Handling.
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-400 sm:text-base">
              We review applications manually, only contact candidates for relevant
              opportunities, and handle your personal information responsibly.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/50">
            {[
              {
                title: "🔒 Your Data Stays Private",
                text: "Your CV and personal information are never sold or shared with third parties without your permission.",
              },
              {
                title: "👨‍💻 Reviewed by a Real Person",
                text: "Every CV and assignment is reviewed manually instead of relying only on automated screening.",
              },
              {
                title: "🎯 Relevant Opportunities Only",
                text: "We only contact you when your profile matches a suitable role or hiring partner.",
              },
              {
                title: "🗑️ Data Deleted If Not Selected",
                text: "If you are not selected to continue, your CV, assignment, and personal information will be permanently deleted within 7 days after the recruitment process concludes.",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className={`p-6 ${
                  index !== 3 ? "border-b border-slate-800" : ""
                }`}
              >
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}