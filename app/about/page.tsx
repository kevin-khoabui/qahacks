import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | QA Hacks",
  description: "Learn more about QA Hacks, our mission, and how we help QA professionals master technical and situational interviews.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">About QA Hacks</h1>
          <p className="mt-2 text-sm text-slate-400">Empowering QA professionals to ace their next career move.</p>
        </div>

        <div className="space-y-6 text-slate-300 leading-relaxed text-sm">
          <p>
            Welcome to <strong className="text-emerald-400">QA Hacks</strong>, the premier interview preparation hub dedicated exclusively to Software Testing and Quality Assurance professionals. Whether you are aiming for an automated testing position, a manual execution role, or a strategic QA leadership seat, our platform provides production-grade answers and blueprints to help you succeed.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">Our Mission</h2>
          <p>
            Traditional interview guides often focus on dry, theoretical definitions that fail to reflect real-world engineering challenges. At QA Hacks, we bridge this gap by transforming complex architectural dilemmas, delivery pressures, and framework scripting into actionable knowledge. 
          </p>

          <h2 className="text-xl font-bold text-white pt-4">What Makes Us Different?</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-slate-100">Production-Grade Scenarios:</strong> Our Q&As focus on actual software life-cycle constraints, microservices architectures, and stakeholder misalignments.</li>
            <li><strong className="text-slate-100">Speaking Blueprints:</strong> We don&apos;t just show you what to write; we provide word-for-word conversational scripts so you can structure your verbal delivery perfectly during high-pressure panels.</li>
            <li><strong className="text-slate-100">Tailored Taxonomy:</strong> Every guide is curated and categorized by specific industry roles, framework stacks (like Playwright, Cypress, JMeter), and difficulty levels.</li>
          </ul>

          <h2 className="text-xl font-bold text-white pt-4">Get In Touch</h2>
          <p>
            We are constantly expanding our knowledge base. If you have any questions, feedback, or business inquiries, please do not hesitate to reach out to us through our dedicated <Link href="/contact" className="text-emerald-400 hover:underline">Contact Page</Link>.
          </p>
        </div>
      </article>
    </main>
  );
}