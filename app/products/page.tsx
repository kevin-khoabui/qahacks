import { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  FileText,
  Star,
  Download,
  CreditCard,
  HelpCircle,
  XCircle,
  MessageSquareText,
  ArrowRight,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Interview Preparation Products | QA Hacks",
  description:
    "Explore QA Hacks premade digital interview preparation products, including QA Lead interview PDF packs with real-world questions, expert answers, bad answers, mistakes, and speaking blueprints.",
};

const GUMROAD_LINK_50 = SITE_CONFIG.links.gumroadProduct50;
const GUMROAD_LINK_30 = SITE_CONFIG.links.gumroadProduct30;

const products = [
  {
    name: "QA Lead Interview Master Pack",
    subtitle: "50 Questions & Answers PDF",
    price: "$49",
    description:
      "A premium QA Lead interview preparation pack with 50 real-world questions, expert answers, bad answer examples, common mistakes, and speaking-style answer templates.",
    features: [
      "50 real-world QA Lead interview questions",
      "Expert answers written in interview-ready format",
      "Bad answer examples and red flags",
      "Common mistakes to avoid",
      "Speaking blueprints for live interviews",
      "Digital PDF product for self-study",
    ],
    href: GUMROAD_LINK_50,
    highlighted: true,
  },
  {
    name: "QA Lead Interview Starter Pack",
    subtitle: "30 Questions & Answers PDF",
    price: "$39",
    description:
      "A focused QA Lead interview preparation pack with 30 practical scenario-based questions and structured answers for candidates preparing for QA leadership interviews.",
    features: [
      "30 practical QA Lead interview questions",
      "Detailed expert answer structure",
      "Bad answer examples",
      "Common mistakes and improvement notes",
      "Useful for quick interview preparation",
      "Digital PDF product for self-study",
    ],
    href: GUMROAD_LINK_30,
    highlighted: false,
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">
        <section className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            QA Hacks Products
          </p>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Premade digital interview preparation products.
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-300">
            QA Hacks sells downloadable PDF interview preparation packs for QA,
            software testing, QA leadership, automation QA, and software engineering
            roles. Each product is designed for self-study and practical interview
            preparation.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          {products.map((product) => (
            <div
              key={product.name}
              className={
                product.highlighted
                  ? "relative rounded-3xl border border-emerald-500/40 bg-slate-900 p-8 shadow-[0_0_50px_rgba(52,211,153,0.12)]"
                  : "relative rounded-3xl border border-slate-800 bg-slate-900/50 p-8"
              }
            >
              {product.highlighted ? (
                <div className="absolute right-6 top-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Most Complete
                </div>
              ) : null}

              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <FileText className="h-6 w-6" />
              </div>

              <h2 className="text-2xl font-black text-white">
                {product.name}
              </h2>

              <p className="mt-2 text-sm font-semibold text-emerald-400">
                {product.subtitle}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                {product.description}
              </p>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-black text-white">
                  {product.price}
                </span>
                <span className="mb-2 text-sm text-slate-500">
                  one-time purchase
                </span>
              </div>

              <ul className="mt-8 space-y-3">
                {product.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-3 text-sm leading-relaxed text-slate-300"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  product.highlighted
                    ? "mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-emerald-400"
                    : "mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-4 text-sm font-black text-slate-100 transition hover:bg-slate-800"
                }
              >
                Buy Now
                <ArrowRight className="h-4 w-4" />
              </a>

              <p className="mt-4 text-center text-xs text-slate-500">
                Secure checkout via external payment provider.
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <HelpCircle className="h-7 w-7 text-indigo-400" />
            <h3 className="mt-4 font-bold text-white">
              Real Interview Questions
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Practical questions based on real QA leadership, testing, release,
              stakeholder, and team management situations.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <Star className="h-7 w-7 text-amber-400" />
            <h3 className="mt-4 font-bold text-white">
              Expert Answer Frameworks
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Structured answers that help candidates explain judgment, ownership,
              trade-offs, risk, and communication clearly.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <MessageSquareText className="h-7 w-7 text-sky-400" />
            <h3 className="mt-4 font-bold text-white">
              Speaking Blueprints
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Interview-ready speaking templates that candidates can practice and
              adapt for live interviews.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
          <h2 className="text-2xl font-bold text-white">
            What Customers Receive
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="flex gap-4">
              <Download className="mt-1 h-6 w-6 shrink-0 text-emerald-400" />
              <div>
                <h3 className="font-semibold text-white">
                  Digital PDF Access
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Customers receive access to premade digital interview preparation
                  materials after purchase.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CreditCard className="mt-1 h-6 w-6 shrink-0 text-emerald-400" />
              <div>
                <h3 className="font-semibold text-white">
                  One-Time Purchase
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Products are sold as one-time purchases. We do not currently
                  offer subscriptions.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <XCircle className="mt-1 h-6 w-6 shrink-0 text-rose-400" />
              <div>
                <h3 className="font-semibold text-white">
                  No Consulting Services
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  QA Hacks does not offer coaching calls, custom services,
                  personalised consulting, recruitment, or job placement services.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-emerald-400" />
              <div>
                <h3 className="font-semibold text-white">
                  Educational Use Only
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Products are educational resources and do not guarantee job
                  offers, interviews, certifications, or employment outcomes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-800 pt-6 text-sm text-slate-400">
          <p>
            Please review our{" "}
            <Link href="/terms" className="text-emerald-400 hover:underline">
              Terms of Service
            </Link>
            ,{" "}
            <Link
              href="/privacy-policy"
              className="text-emerald-400 hover:underline"
            >
              Privacy Policy
            </Link>
            , and{" "}
            <Link
              href="/refund-policy"
              className="text-emerald-400 hover:underline"
            >
              Refund Policy
            </Link>{" "}
            before purchasing.
          </p>
        </section>
      </div>
    </main>
  );
}