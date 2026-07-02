import { Metadata } from "next";
import Link from "next/link";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "About QA Hacks | Interview Preparation for QA & Software Engineering Roles",
  description:
    "Learn about QA Hacks, a digital interview preparation platform offering premade PDF guides, real-world interview questions, expert answers, bad answer examples, and speaking blueprints for QA and software engineering roles.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto space-y-10">
        <section className="border-b border-slate-800 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            About QA Hacks
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Practical interview preparation for QA and software engineering careers.
          </h1>

          <p className="mt-5 max-w-3xl text-base text-slate-300 leading-relaxed">
            QA Hacks helps candidates prepare for real technical interviews by providing
            practical, role-specific interview questions, expert answers, bad answer
            examples, common mistakes, and speaking-style answer templates.
          </p>
        </section>

        <section className="space-y-6 text-slate-300 leading-relaxed">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-2xl font-bold text-white">What QA Hacks Does</h2>

            <p className="mt-4">
              QA Hacks creates premade digital interview preparation products for
              professionals who want to improve how they answer real-world technical,
              situational, and leadership interview questions.
            </p>

            <p className="mt-4">
              Our materials are designed for candidates preparing for roles such as
              Manual QA Engineer, Automation QA Engineer, QA Lead, QA Manager,
              Software Tester, and Software Engineer. Instead of focusing only on
              textbook definitions, QA Hacks focuses on practical workplace scenarios,
              decision-making, communication, risk management, and execution.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Our Mission</h2>

            <p className="mt-4">
              Our mission is to help candidates give clearer, stronger, and more
              practical interview answers. Many candidates understand testing or
              software development, but struggle to explain their thinking in a
              structured and confident way during interviews.
            </p>

            <p className="mt-4">
              QA Hacks bridges that gap by turning real interview scenarios into
              clear answer frameworks. Each guide is created to help candidates
              understand what interviewers are evaluating, what weak answers look
              like, what strong answers should include, and how to speak with more
              confidence in an interview.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">What We Sell</h2>

            <p className="mt-4">
              QA Hacks sells premade digital products only. Our products are
              downloadable interview preparation resources, usually delivered as PDF
              packs or digital study guides.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                <h3 className="font-semibold text-white">
                  Interview Question Packs
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Collections of practical questions and answers for specific roles,
                  difficulty levels, and interview situations.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                <h3 className="font-semibold text-white">
                  Role-Specific PDF Guides
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Premade guides for QA Lead, Manual QA, Automation QA, Software
                  Tester, and Software Engineer interview preparation.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                <h3 className="font-semibold text-white">
                  Speaking Answer Templates
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Structured speaking blueprints that help candidates answer clearly
                  in live interviews.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                <h3 className="font-semibold text-white">
                  Scenario-Based Preparation
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Real-world scenarios covering release risk, bug prioritization,
                  test strategy, stakeholder communication, and leadership decisions.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              What Each Guide Typically Includes
            </h2>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                <strong className="text-slate-100">Real-world interview questions</strong>{" "}
                based on practical workplace situations.
              </li>
              <li>
                <strong className="text-slate-100">Expert answers</strong> written in
                a clear and structured interview-ready format.
              </li>
              <li>
                <strong className="text-slate-100">Bad answer examples</strong> to help
                candidates understand what to avoid.
              </li>
              <li>
                <strong className="text-slate-100">Common mistakes</strong> that often
                make interview answers sound weak, vague, or too theoretical.
              </li>
              <li>
                <strong className="text-slate-100">Speaking blueprints</strong> that
                candidates can practice and adapt for live interviews.
              </li>
              <li>
                <strong className="text-slate-100">Practical guidance</strong> for
                explaining ownership, risk, trade-offs, collaboration, and decision-making.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              Premade Digital Products Only
            </h2>

            <p className="mt-4">
              QA Hacks does not currently offer consultations, coaching calls,
              custom interview preparation, personalised services, recruitment
              services, certification programs, or job placement services.
            </p>

            <p className="mt-4">
              Customers purchase ready-made digital materials that they can download
              and use for self-study. Our products are educational resources designed
              to support interview preparation, but they do not guarantee job offers,
              interview invitations, certifications, or employment outcomes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Who QA Hacks Is For</h2>

            <p className="mt-4">
              QA Hacks is built for candidates who want practical preparation instead
              of generic interview advice. It is especially useful for people preparing
              for interviews where they need to explain real work experience, testing
              judgment, engineering decisions, team communication, risk management,
              and problem-solving under pressure.
            </p>
          </div>

         {/*  <div className="rounded-2xl border border-emerald-900/60 bg-emerald-950/20 p-6">
            <h2 className="text-2xl font-bold text-white">
              Explore Our Products
            </h2>

            <p className="mt-4 text-slate-300">
              You can explore our interview preparation products and resources on
              our website. Each product page explains what is included, who the
              product is for, and how the material can be used for interview practice.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                View Products
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-900"
              >
                Contact Us
              </Link>
            </div>
          </div> */}

          <div className="border-t border-slate-800 pt-6 text-sm text-slate-400">
            <p>
              For questions, feedback, or business inquiries, please contact us
              through our{" "}
              <Link href="/contact" className="text-emerald-400 hover:underline">
                Contact Page
              </Link>
              .
            </p>

            <p className="mt-3">
              Please also review our{" "}
              <Link href="/terms" className="text-emerald-400 hover:underline">
                Terms of Service
              </Link>
              ,{" "}
              <Link href="/privacy" className="text-emerald-400 hover:underline">
                Privacy Policy
              </Link>
              , and{" "}
              <Link href="/refund-policy" className="text-emerald-400 hover:underline">
                Refund Policy
              </Link>
              .
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}