// app/about/page.tsx

import { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  BriefcaseBusiness,
  Globe2,
  ShieldCheck,
  Users,
  Mail,
  ArrowRight,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "About QA Hacks | Software Engineering Career Platform",
  description:
    "QA Hacks helps software professionals grow through interview preparation, engineering insights, Substack resources, and a growing career network.",
  alternates: {
    canonical: "https://qahacks.com/about",
  },
};

const focusAreas = [
  {
    title: "Interview Preparation",
    description:
      "Practical interview preparation for Software Engineers, QA Engineers, SDETs, AI Software Engineers, Engineering Managers, and other technical roles.",
    icon: BookOpen,
  },
  {
    title: "Career Network",
    description:
      "A growing talent network for software professionals interested in remote, relocation-supported, and visa sponsorship opportunities when available.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Engineering Insights",
    description:
      "Deep dives covering software engineering, software testing, AI development, automation, architecture, leadership, and career growth.",
    icon: Cpu,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-14">
        {/* Hero */}
        <section className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            About QA Hacks
          </p>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Helping software professionals prepare, grow, and connect with better opportunities.
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-300">
            QA Hacks is a software engineering career platform for professionals
            across Software Engineering, QA, SDET, AI Engineering, Automation,
            and technical leadership roles.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={SITE_CONFIG.links.substack}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-4 text-sm font-black text-slate-950 transition hover:bg-emerald-400"
            >
              Subscribe on Substack
              <Mail className="h-4 w-4" />
            </a>

            <Link
              href="/career"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-emerald-500/40 px-7 py-4 text-sm font-bold text-emerald-400 transition hover:bg-emerald-500/10"
            >
              Join Career Network
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Mission */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-400">
                Our Mission
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
                Make software career growth more practical, global, and accessible.
              </h2>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-slate-400 sm:text-base">
              <p>
                Many software professionals struggle not because they lack ability,
                but because they do not know how to communicate their technical
                thinking, ownership, trade-offs, problem-solving process, and real
                project decisions clearly.
              </p>

              <p>
                QA Hacks exists to help candidates prepare for real interviews,
                improve practical engineering thinking, and discover career
                opportunities around the world.
              </p>

              <p>
                We focus on practical guidance, not textbook theory. Our content is
                built around real-world engineering scenarios, interview expectations,
                communication, decision-making, and career readiness.
              </p>
            </div>
          </div>
        </section>

        {/* Focus Areas */}
        <section className="grid gap-6 md:grid-cols-3">
          {focusAreas.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-800 bg-slate-900/50 p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-lg font-black text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* What We Offer */}
        <section className="rounded-3xl border border-emerald-500/20 bg-slate-900/70 p-8 sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-400">
            What We Offer
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
            Content, insights, and career support for software professionals.
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[
              "Interview preparation across software engineering disciplines",
              "Real-world engineering scenarios, case studies, and decision-making frameworks",
              "Software testing, automation, AI development, and engineering leadership resources",
              "Substack newsletter with deeper software career and engineering insights",
              "Career Network for software professionals worldwide",
              "Remote, relocation, and visa sponsorship opportunities when available",
              "Human-reviewed candidate screening for selected opportunities",
              "Practical guidance for communication, ownership, risk, and technical trade-offs",
            ].map((item) => (
              <div key={item} className="flex gap-3 text-sm text-slate-300">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Trust */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
            <Users className="h-8 w-8 text-emerald-400" />

            <h2 className="mt-5 text-2xl font-black text-white">
              Built for software professionals
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Whether you are a Software Engineer, QA Engineer, Automation Engineer,
              SDET, AI Software Engineer, Engineering Manager, or technical leader,
              QA Hacks provides practical resources designed for real-world technical
              careers.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
            <ShieldCheck className="h-8 w-8 text-emerald-400" />

            <h2 className="mt-5 text-2xl font-black text-white">
              Practical and transparent
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              We do not promise guaranteed jobs, interviews, visa sponsorship, or
              employment outcomes. We provide practical learning resources, career
              support, and a network where suitable opportunities may be shared with
              qualified candidates.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-linear-to-br from-emerald-900/20 to-slate-900 p-8 text-center sm:p-12">
          <div className="absolute left-1/2 top-0 h-full w-full -translate-x-1/2 bg-emerald-500/10 blur-[100px]" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Stay connected with QA Hacks
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
              Subscribe to our Substack for interview insights, software engineering
              career advice, real-world technical scenarios, AI development insights,
              and future opportunity updates.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={SITE_CONFIG.links.substack}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-sm font-black text-slate-950 transition hover:bg-emerald-400 sm:w-auto"
              >
                Subscribe to Substack
                <ArrowRight className="h-4 w-4" />
              </a>

              <Link
                href="/career"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/50 px-8 py-4 text-sm font-bold text-emerald-400 transition hover:bg-emerald-500/10 sm:w-auto"
              >
                Join Career Network
              </Link>
            </div>
          </div>
        </section>

        {/* Legal Note */}
        <section className="border-t border-slate-800 pt-6 text-sm text-slate-400">
          <p>
            QA Hacks is an independent software engineering career platform
            providing educational resources, interview preparation, engineering
            insights, newsletters, and career network support for software
            professionals worldwide. We do not guarantee job offers, interviews,
            visa sponsorship, relocation, or employment outcomes.
          </p>
        </section>
      </div>
    </main>
  );
}