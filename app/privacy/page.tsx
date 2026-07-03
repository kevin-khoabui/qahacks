import { Metadata } from "next";
import Link from "next/link";

// 🚀 BỔ SUNG: Khai báo thẻ Canonical
export const metadata: Metadata = {
  title: "Privacy Policy | QA Hacks",
  description:
    "Read the QA Hacks Privacy Policy to understand how we collect, use, and protect information related to our website and digital interview preparation products.",
  alternates: {
    canonical: "https://qahacks.com/privacy",
  },
};

export default function PrivacyPage() {
  // 🚀 BỔ SUNG: Khai báo Schema cho trang Privacy
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy | QA Hacks",
    "url": "https://qahacks.com/privacy",
    "description": "Read the QA Hacks Privacy Policy to understand how we collect, use, and protect information related to our website and digital interview preparation products."
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      {/* Inject Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <article className="max-w-4xl mx-auto space-y-10">
        <section className="border-b border-slate-800 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            QA Hacks Privacy Policy
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-4 text-sm text-slate-400">
            Last updated: June 26, 2026
          </p>

          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300">
            This Privacy Policy explains how QA Hacks collects, uses, and protects
            information when you visit our website, purchase our digital products,
            or contact us for support.
          </p>
        </section>

        <section className="space-y-8 text-sm leading-relaxed text-slate-300">
          <div>
            <h2 className="text-2xl font-bold text-white">
              1. Who We Are
            </h2>

            <p className="mt-4">
              QA Hacks operates the website{" "}
              <a
                href="https://qahacks.com"
                className="text-emerald-400 hover:underline"
              >
                https://qahacks.com
              </a>
              . We provide premade digital interview preparation products,
              including downloadable PDF guides, interview question packs,
              expert answer examples, bad answer examples, common mistakes, and
              speaking-style answer templates for QA and software engineering
              roles.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              2. Information We Collect
            </h2>

            <p className="mt-4">
              We may collect limited information when you use our website,
              purchase a product, or contact us. This may include:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                <strong className="text-slate-100">Contact information:</strong>{" "}
                such as your name and email address when you contact us or make
                a purchase.
              </li>
              <li>
                <strong className="text-slate-100">Order information:</strong>{" "}
                such as the product purchased, order status, transaction
                reference, and purchase date.
              </li>
              <li>
                <strong className="text-slate-100">Support information:</strong>{" "}
                such as messages you send to us, including product questions or
                support requests.
              </li>
              <li>
                <strong className="text-slate-100">Website usage information:</strong>{" "}
                such as browser type, pages visited, referring pages, device
                information, approximate location, and technical logs.
              </li>
            </ul>

            <p className="mt-4">
              We do not intentionally collect sensitive personal information
              through our website.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              3. Payment Processing
            </h2>

            <p className="mt-4">
              Payments for QA Hacks products may be processed by third-party
              payment providers such as Lemon Squeezy or other checkout
              providers we use. We do not store full credit card numbers or full
              payment card details on our own servers.
            </p>

            <p className="mt-4">
              Payment providers may collect and process payment information in
              accordance with their own privacy policies and security practices.
              We may receive limited order-related information, such as your
              email address, product purchased, order ID, payment status, and
              transaction date, so we can provide access to your digital product
              and support your order.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              4. How We Use Information
            </h2>

            <p className="mt-4">
              We use the information we collect for the following purposes:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>To provide access to purchased digital products.</li>
              <li>To process and manage orders.</li>
              <li>To respond to support requests, questions, or business inquiries.</li>
              <li>To improve our website, products, and customer experience.</li>
              <li>To detect, prevent, or respond to fraud, abuse, or technical issues.</li>
              <li>To comply with legal, tax, accounting, or platform requirements.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              5. Cookies and Analytics
            </h2>

            <p className="mt-4">
              QA Hacks may use cookies, analytics tools, and similar technologies
              to understand how visitors use our website, improve site
              performance, and measure content effectiveness.
            </p>

            <p className="mt-4">
              These tools may collect information such as browser type, device
              type, pages visited, time spent on pages, referring websites, and
              general usage patterns. You can usually control or disable cookies
              through your browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              6. Advertising and Third-Party Services
            </h2>

            <p className="mt-4">
              We may use third-party services for analytics, payments, hosting,
              email communication, product delivery, or advertising. These
              services may process limited information on our behalf or according
              to their own policies.
            </p>

            <p className="mt-4">
              If QA Hacks uses advertising services such as Google AdSense or
              similar advertising partners in the future, those partners may use
              cookies or similar technologies to serve and measure ads. You can
              learn more about Google advertising technologies at{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline"
              >
                Google Advertising Policies
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              7. Digital Product Delivery
            </h2>

            <p className="mt-4">
              QA Hacks sells premade digital products only. When you purchase a
              product, your email address and order information may be used to
              deliver download access, send purchase confirmations, or provide
              customer support.
            </p>

            <p className="mt-4">
              We do not sell consulting services, personalised coaching,
              recruitment services, certification programs, or job placement
              services through QA Hacks.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              8. Data Sharing
            </h2>

            <p className="mt-4">
              We do not sell your personal information. We may share limited
              information only when necessary with:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Payment processors to complete purchases.</li>
              <li>Hosting and infrastructure providers to operate our website.</li>
              <li>Email or support tools to respond to your requests.</li>
              <li>Analytics providers to understand website performance.</li>
              <li>Legal or regulatory authorities when required by law.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              9. Data Retention
            </h2>

            <p className="mt-4">
              We keep information only for as long as reasonably necessary to
              provide our products, support customers, maintain business records,
              comply with legal obligations, resolve disputes, and improve our
              services.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              10. Data Security
            </h2>

            <p className="mt-4">
              We take reasonable steps to protect information from unauthorized
              access, loss, misuse, or disclosure. However, no method of online
              transmission or digital storage is completely secure, so we cannot
              guarantee absolute security.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              11. Your Rights
            </h2>

            <p className="mt-4">
              Depending on your location, you may have rights to request access,
              correction, deletion, or restriction of your personal information.
              You may also request information about how your data is used.
            </p>

            <p className="mt-4">
              To make a privacy-related request, please contact us at{" "}
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
              12. Children&apos;s Privacy
            </h2>

            <p className="mt-4">
              QA Hacks is not intended for children under the age of 13. We do
              not knowingly collect personal information from children under 13.
              If you believe a child has provided us with personal information,
              please contact us and we will take appropriate steps to remove it.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              13. International Users
            </h2>

            <p className="mt-4">
              QA Hacks may be accessed by users in different countries. By using
              our website or purchasing our products, you understand that your
              information may be processed in countries where our service
              providers operate.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              14. Changes to This Privacy Policy
            </h2>

            <p className="mt-4">
              We may update this Privacy Policy from time to time. When we make
              changes, we will update the “Last updated” date at the top of this
              page. Your continued use of the website after changes are posted
              means you accept the updated policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              15. Contact Us
            </h2>

            <p className="mt-4">
              If you have questions about this Privacy Policy or how we handle
              information, please contact us:
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
                href="/refund-policy"
                className="text-emerald-400 hover:underline"
              >
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