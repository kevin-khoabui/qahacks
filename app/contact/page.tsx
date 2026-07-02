import { Metadata } from "next";
import Link from "next/link";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Contact QA Hacks | Support & Business Inquiries",
  description:
    "Contact QA Hacks for product support, digital download questions, business inquiries, or feedback about our interview preparation PDF products.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <section className="border-b border-slate-800 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Contact QA Hacks
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Get in touch with QA Hacks.
          </h1>

          <p className="mt-5 max-w-3xl text-base text-slate-300 leading-relaxed">
            Have a question about our interview preparation products, digital
            downloads, website, or business inquiries? You can contact us using
            the details below.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <h2 className="text-xl font-bold text-white">Product Support</h2>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              For questions about your purchase, digital download access, PDF
              products, product content, or account-related support, please email
              us directly.
            </p>

            <a
              href="mailto:contact@qahacks.com"
              className="mt-5 inline-block font-semibold text-emerald-400 hover:underline"
            >
              contact@qahacks.com
            </a>

            <p className="mt-4 text-xs text-slate-500">
              Please include your order email and product name if your question
              is related to a purchase.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-teal-400" />
              <h2 className="text-xl font-bold text-white">Business Inquiries</h2>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              For partnership inquiries, platform questions, review requests, or
              general business communication, please contact us by email or
              connect with us on LinkedIn.
            </p>

            <div className="mt-5 flex flex-col gap-3 text-sm">
              <a
                href="mailto:contact@qahacks.com"
                className="font-semibold text-emerald-400 hover:underline"
              >
                contact@qahacks.com
              </a>

              <a
                href="https://www.linkedin.com/company/qahacks/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-400 hover:underline"
              >
                LinkedIn: QA Hacks
              </a>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-2xl font-bold text-white">
            What We Can Help With
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5">
              <h3 className="font-semibold text-white">Purchase Questions</h3>
              <p className="mt-2 text-sm text-slate-400">
                Questions about product pricing, digital downloads, file access,
                or order-related issues.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5">
              <h3 className="font-semibold text-white">Product Information</h3>
              <p className="mt-2 text-sm text-slate-400">
                Questions about what is included in our interview preparation PDF
                packs and digital guides.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5">
              <h3 className="font-semibold text-white">Website Feedback</h3>
              <p className="mt-2 text-sm text-slate-400">
                Feedback about our website, content quality, product pages, or
                user experience.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5">
              <h3 className="font-semibold text-white">Business Review</h3>
              <p className="mt-2 text-sm text-slate-400">
                Information for payment processors, platform reviews, compliance
                checks, or business verification.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-900/60 bg-emerald-950/20 p-6">
          <h2 className="text-2xl font-bold text-white">
            Important Product Notice
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            QA Hacks sells premade digital interview preparation products only.
            Our products are downloadable PDF guides and digital study materials
            designed for self-study.
          </p>

          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            We do not currently offer consulting services, coaching calls,
            personalised interview preparation, custom services, recruitment
            services, certification programs, or job placement services.
          </p>
        </section>

        <section className="border-t border-slate-800 pt-6 text-sm text-slate-400">
          <p>
            Before contacting us, you may also review our{" "}
            <Link href="/terms" className="text-emerald-400 hover:underline">
              Terms of Service
            </Link>
            ,{" "}
            <Link
              href="/privacy"
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
            </Link>
            .
          </p>

          <p className="mt-4 text-xs text-slate-500">
            To keep our website simple and secure, we currently do not use a
            database-driven contact form. Please contact us directly by email.
          </p>
        </section>
      </div>
    </main>
  );
}