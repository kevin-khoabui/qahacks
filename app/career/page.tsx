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
            Connect with companies hiring Manual QA, Automation QA, SDET, QA
            Leaders, and Software Engineers worldwide. Some opportunities may
            support visa sponsorship, remote work, or relocation depending on
            the role and hiring company.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300">
              🌍 Global QA Talent
            </span>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300">
              💼 Remote Roles
            </span>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300">
              🛂 Visa Sponsorship
            </span>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300">
              🤝 Human Review
            </span>
          </div>
        </div>
      </section>

      {/* Opportunity Note */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-500/20 bg-slate-900/70 p-8 shadow-xl">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-400">
            Opportunity Support
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
            Visa Sponsorship & Remote Work May Be Available
          </h2>

          <p className="mt-5 text-sm leading-relaxed text-slate-400 sm:text-base">
            Some roles may offer visa sponsorship, relocation support, or remote
            work options. Availability depends on the specific position, hiring
            company, country requirements, and candidate profile.
          </p>

          <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
            Please provide accurate information in your CV and application form
            so we can better understand which opportunities may fit your
            situation.
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
        Our process is designed to be practical, transparent, and respectful of
        your time. If you pass the assignment round, we aim to complete the
        remaining interview rounds within 2 weeks.
      </p>
    </div>

    <div className="mt-10 grid gap-5 lg:grid-cols-3">
      {[
        {
          round: "Round 1",
          title: "Work-from-Home Assignment",
          time: "72-hour submission window",
          text: "Complete real-world QA scenario questions independently from home. This helps us understand your QA thinking, communication, and problem-solving approach.",
        },
        {
          round: "Round 2",
          title: "Technical Interview",
          time: "60 minutes",
          text: "Meet with a Technical Engineer or Senior Engineer to discuss your assignment, QA experience, testing mindset, and real project decision-making.",
        },
        {
          round: "Round 3",
          title: "CEO / Manager Interview",
          time: "30 minutes",
          text: "Discuss behavior, communication, expectations, salary, availability, and next steps, including visa sponsorship if required for the role.",
        },
      ].map((item, index) => (
        <div
          key={item.round}
          className="relative rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl"
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
        If you pass the assignment round, you will be invited to interview with
        a Technical Engineer or Senior Engineer. We aim to complete Round 2 and
        Round 3 within a maximum of 2 weeks to reduce candidate waiting time and
        move forward quickly with the visa sponsorship process when applicable.
      </p>
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
              [
                "1",
                "Submit Your CV",
                "Share your profile, experience, and career goals.",
              ],
              [
                "2",
                "Human Review",
                "Your CV is reviewed manually by a real person, so it may take longer than usual.",
              ],
              [
                "3",
                "Scenario Assessment",
                "Selected candidates may receive real-world QA questions to complete independently.",
              ],
              [
                "4",
                "We Contact You",
                "If there is a match, we’ll reach out by email with the next step.",
              ],
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
            After submitting your CV, selected candidates may receive a short set
            of real-world QA scenario questions. You will have at least 72 hours
            to complete and submit your answers.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm font-bold text-white">Important:</p>

            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              This assessment must be completed independently. Please do not use
              AI tools to generate your answers. We use this step to understand
              your real QA thinking, communication style, and problem-solving
              approach.
            </p>
          </div>
        </div>
      </section>

      {/* Review Timeline */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <h2 className="text-2xl font-black">⏳ Review Timeline</h2>

          <div className="mt-5 space-y-3 text-sm leading-relaxed text-slate-400">
            <p>
              All CVs and assignment results are reviewed by a real person, not
              an automated screening system.
            </p>
            <p>
              Because of this manual review process, it may take more time than
              a typical automated application flow.
            </p>
            <p>
              If your profile or assignment result matches a suitable
              opportunity, we will contact you by email.
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
            <p>You can request removal of your information at any time.</p>
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
                "Do you support visa sponsorship?",
                "Some opportunities may support visa sponsorship, but it depends on the specific role, hiring company, and country requirements.",
              ],
              [
                "Do you offer remote work opportunities?",
                "Some roles may support remote work, hybrid work, or relocation. Availability depends on each position.",
              ],
              [
                "Will I definitely get an interview?",
                "No. We contact candidates whose profiles match available opportunities.",
              ],
              [
                "Why can the review process take longer?",
                "CVs and assignment results are reviewed manually by a real person, so the process may take longer than automated screening.",
              ],
              [
                "Who should apply?",
                "Manual QA Engineers, Automation QA Engineers, QA Leaders, SDETs, and Software Engineers.",
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