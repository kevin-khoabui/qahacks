import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy | QA Hacks",
  description:
    "Read the QA Hacks Refund Policy for premade digital interview preparation products, PDF guides, and downloadable study materials.",
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto space-y-10">
        <section className="border-b border-slate-800 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            QA Hacks Refund Policy
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Refund Policy
          </h1>

          <p className="mt-4 text-sm text-slate-400">
            Last updated: June 26, 2026
          </p>

          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300">
            This Refund Policy explains how refunds are handled for QA Hacks
            premade digital interview preparation products, including PDF guides,
            interview question packs, and downloadable study materials.
          </p>
        </section>

        <section className="space-y-8 text-sm leading-relaxed text-slate-300">
          <div>
            <h2 className="text-2xl font-bold text-white">
              1. Digital Product Notice
            </h2>

            <p className="mt-4">
              QA Hacks sells premade digital products only. Our products are
              downloadable interview preparation materials, such as PDF guides,
              question-and-answer packs, speaking answer templates, and study
              resources.
            </p>

            <p className="mt-4">
              Because our products are digital downloads, they may become
              accessible immediately after purchase. For this reason, refund
              eligibility is limited once the product has been delivered,
              downloaded, accessed, or used.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              2. General Refund Rule
            </h2>

            <p className="mt-4">
              All sales of digital products are generally final after the product
              has been delivered or accessed. However, we review refund requests
              case by case and will make reasonable efforts to resolve legitimate
              issues.
            </p>

            <p className="mt-4">
              If you believe there is a problem with your order, please contact
              us as soon as possible at{" "}
              <a
                href="mailto:contact@qahacks.com"
                className="text-emerald-400 hover:underline"
              >
                contact@qahacks.com
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              3. Refunds May Be Approved In These Cases
            </h2>

            <p className="mt-4">
              We may approve a refund in situations such as:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                You were charged more than once for the same product because of a
                duplicate transaction.
              </li>
              <li>
                You purchased the wrong product and contacted us before accessing
                or downloading the product.
              </li>
              <li>
                You did not receive access to the purchased product due to a
                technical delivery issue.
              </li>
              <li>
                The delivered file is corrupted, inaccessible, or materially
                different from the product description.
              </li>
              <li>
                A payment processor or platform error caused an incorrect charge.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              4. Refunds Are Usually Not Available In These Cases
            </h2>

            <p className="mt-4">
              Refunds are usually not provided for the following reasons:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                You changed your mind after purchasing and accessing the product.
              </li>
              <li>
                You downloaded, opened, copied, or used the digital material.
              </li>
              <li>
                You expected live coaching, consultation, custom service, or
                personalised interview preparation, but the product page clearly
                described the product as a premade digital download.
              </li>
              <li>
                You did not get a job offer, interview invitation, promotion, or
                specific career outcome after using the material.
              </li>
              <li>
                You no longer need the product after purchase.
              </li>
              <li>
                You violated our Terms of Service, including unauthorized sharing,
                resale, redistribution, or misuse of the product.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              5. How To Request a Refund
            </h2>

            <p className="mt-4">
              To request a refund review, please email us at{" "}
              <a
                href="mailto:contact@qahacks.com"
                className="text-emerald-400 hover:underline"
              >
                contact@qahacks.com
              </a>{" "}
              with the following information:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Your order email address.</li>
              <li>The product name.</li>
              <li>Your order ID or transaction reference, if available.</li>
              <li>A clear explanation of the issue.</li>
              <li>Any screenshots or supporting details, if relevant.</li>
            </ul>

            <p className="mt-4">
              We may ask for additional information to verify the order and
              investigate the issue.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              6. Review Time
            </h2>

            <p className="mt-4">
              We aim to review refund requests within 5 business days. The final
              timing of the refund, if approved, may depend on the payment
              processor, bank, card provider, or checkout platform used for the
              purchase.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              7. Payment Processor Policies
            </h2>

            <p className="mt-4">
              Purchases may be processed through third-party payment platforms
              such as Lemon Squeezy or other checkout providers. Approved refunds
              may be subject to the processing rules, timelines, and limitations
              of the payment provider.
            </p>

            <p className="mt-4">
              QA Hacks does not store full credit card details and does not
              directly control bank processing times after a refund has been
              issued.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              8. No Career Outcome Guarantee
            </h2>

            <p className="mt-4">
              QA Hacks products are educational interview preparation resources.
              We do not guarantee job offers, interview invitations, employment,
              promotions, certifications, salary increases, or any specific
              career result.
            </p>

            <p className="mt-4">
              Refunds will not be issued solely because a customer did not
              achieve a specific interview or career outcome after using the
              product.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              9. Product Access Issues
            </h2>

            <p className="mt-4">
              If you cannot access your purchased product, please contact us
              before submitting a refund request. In many cases, we can resolve
              access issues by resending the download link, confirming the order
              email, or providing updated access instructions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              10. Changes to This Refund Policy
            </h2>

            <p className="mt-4">
              We may update this Refund Policy from time to time. When we make
              changes, we will update the “Last updated” date at the top of this
              page. The policy in effect at the time of purchase will generally
              apply to that purchase, unless otherwise required by law.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              11. Contact Us
            </h2>

            <p className="mt-4">
              If you have questions about this Refund Policy or need help with a
              purchase, please contact us:
            </p>

            <p className="mt-4">
              Email:{" "}
              <a
                href="mailto:contact@qahacks.com"
                className="text-emerald-400 hover:underline"
              >
                contact@qahacks.com
              </a>
            </p>

            <p className="mt-6 text-slate-400">
              You may also review our{" "}
              <Link href="/terms" className="text-emerald-400 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-emerald-400 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}