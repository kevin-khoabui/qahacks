// app/assignment/page.tsx

import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Submit Assignment | QA Hacks",
    description:
        "Submit your QA assignment result for the QA Hacks candidate screening process.",
};

export default function AssignmentPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="px-4 pt-24 pb-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl text-center">
                    <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-400">
                        QA Hacks Candidate Assignment
                    </p>

                    <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
                        Submit Your Assignment Result
                    </h1>

                    <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-400 sm:text-lg">
                        Please submit your completed QA assignment within the required
                        deadline. Your answers will help us understand your real-world QA
                        thinking, communication style, and problem-solving approach.
                    </p>
                </div>
            </section>

            <section className="px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
                    {[
                        [
                            "72 Hours",
                            "Submit your assignment within 72 hours after receiving the questions.",
                        ],
                        [
                            "No AI Answers",
                            "Your answers must be written independently without AI-generated content.",
                        ],
                        [
                            "Real-World Scenarios",
                            "The assignment focuses on practical QA situations, not textbook definitions.",
                        ],
                    ].map(([title, text]) => (
                        <div
                            key={title}
                            className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl"
                        >
                            <h2 className="text-lg font-black text-white">{title}</h2>
                            <p className="mt-3 text-sm leading-relaxed text-slate-400">
                                {text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-500/20 bg-slate-900/70 p-8 shadow-xl">
                    <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-400">
                        Before You Submit
                    </p>

                    <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
                        Submission Requirements
                    </h2>

                    <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-400 sm:text-base">
                        <p>
                            Make sure your assignment result is complete, clearly written, and
                            submitted using the same email address you used for your
                            application.
                        </p>

                        <p>
                            If your assignment requires a public link, please ensure the link
                            is accessible before submitting. We may not be able to review
                            private or restricted links.
                        </p>

                        <p>
                            We review assignments manually. Selected candidates will be
                            contacted by email for the next step.
                        </p>
                    </div>
                </div>
            </section>

            <section className="px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl rounded-[2rem] border border-emerald-500/20 bg-slate-900/70 p-3 shadow-2xl sm:p-6">
                    <iframe
                        data-tally-src="https://tally.so/embed/RGa09j?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                        loading="lazy"
                        width="100%"
                        height="500"
                        frameBorder="0"
                        title="QA Hacks Assignment Submission Form"
                    />
                </div>

                <Script
                    src="https://tally.so/widgets/embed.js"
                    strategy="afterInteractive"
                />
            </section>
        </main>
    );
}