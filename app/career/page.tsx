// app/career/page.tsx

import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Career Network | QA Hacks",
  description:
    "Join the QA Hacks Career Network for QA opportunities, remote roles, relocation-supported jobs, and visa sponsorship opportunities.",
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
            Connect with companies hiring Manual QA, Automation QA, SDET, and QA
            Leaders worldwide. Submit your CV and we’ll contact you when a
            suitable opportunity becomes available.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300">
              🌍 Global QA Talent
            </span>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300">
              💼 Remote & Relocation Roles
            </span>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300">
              🤝 Human Review
            </span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-black tracking-tight">
            What Happens Next?
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["1", "Submit Your CV", "Share your profile, experience, and career goals."],
              ["2", "We Review", "Your profile is reviewed manually by a real person."],
              ["3", "We Match", "We look for relevant QA opportunities that fit your profile."],
              ["4", "We Contact You", "If there is a match, we’ll reach out by email."],
            ].map(([step, title, text]) => (
              <div
                key={step}
                className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-sm font-black text-slate-950">
                  {step}
                </div>
                <h3 className="text-lg font-black">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* Candidate Screening */}
<section className="px-4 py-10 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-500/20 bg-slate-900/70 p-8 shadow-xl">
    <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-400">
      Screening Process
    </p>

    <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
      Real-World QA Scenario Assessment
    </h2>

    <p className="mt-5 text-sm leading-relaxed text-slate-400 sm:text-base">
      After submitting your CV, selected candidates may receive a short set of
      real-world QA scenario questions. You will have 48 hours to complete and
      submit your answers.
    </p>

    <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      <p className="text-sm font-bold text-white">
        Important:
      </p>

      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        This assessment must be completed independently. Please do not use AI
        tools to generate your answers. We use this step to understand your real
        QA thinking, communication style, and problem-solving approach.
      </p>
    </div>
  </div>
</section>

      {/* Form */}
     {/* Form */}
<section className="px-4 py-12 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-4xl rounded-4xl border border-emerald-500/20 bg-slate-900/70 p-3 shadow-2xl sm:p-6">
    <iframe
      data-tally-src="https://tally.so/embed/OD9D27?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
      loading="lazy"
      width="100%"
      height="500"
      frameBorder="0"
      marginHeight={0}
      marginWidth={0}
      title="QA Hacks Career Network Form"
    />
  </div>

  <Script
    src="https://tally.so/widgets/embed.js"
    strategy="afterInteractive"
  />
</section>

      {/* Privacy */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <h2 className="text-2xl font-black">🔒 Privacy Promise</h2>

          <div className="mt-5 space-y-3 text-sm leading-relaxed text-slate-400">
            <p>Your information is kept private.</p>
            <p>We never sell your personal data.</p>
            <p>
              Your profile is reviewed only for relevant QA career opportunities.
            </p>
            <p>
              You can request removal of your information at any time.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pt-8 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-black">FAQ</h2>

          <div className="mt-8 space-y-4">
            {[
              [
                "Do I need to pay?",
                "No. Joining the QA Hacks Career Network is completely free.",
              ],
              [
                "Will I definitely get an interview?",
                "No. We contact candidates whose profiles match available opportunities.",
              ],
              [
                "Can I update my CV later?",
                "Yes. Simply submit the latest version through the form.",
              ],
              [
                "Who should apply?",
                "Manual QA Engineers, Automation QA Engineers, SDETs, QA Leads, and Software Test Engineers.",
              ],
            ].map(([question, answer]) => (
              <div
                key={question}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"
              >
                <h3 className="font-black text-white">{question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}