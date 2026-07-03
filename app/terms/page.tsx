import { Metadata } from "next";
import Link from "next/link";

// 🚀 THÊM 2 DÒNG NÀY ĐỂ FIX LỖI BUILD:
// export const runtime = 'edge';
// export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Terms of Service | QA Hacks",
  description:
    "Read the QA Hacks Terms of Service for using our website and purchasing premade digital interview preparation products.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto space-y-10">
        <section className="border-b border-slate-800 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            QA Hacks Terms
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Terms of Service
          </h1>

          <p className="mt-4 text-sm text-slate-400">
            Last updated: June 26, 2026
          </p>

          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300">
            These Terms of Service explain the rules for using QA Hacks, accessing
            our website, and purchasing our premade digital interview preparation
            products.
          </p>
        </section>

        <section className="space-y-8 text-sm leading-relaxed text-slate-300">
          <div>
            <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>

            <p className="mt-4">
              By accessing or using{" "}
              <a
                href="https://qahacks.com"
                className="text-emerald-400 hover:underline"
              >
                https://qahacks.com
              </a>
              , purchasing our products, or downloading our digital materials,
              you agree to these Terms of Service. If you do not agree with these
              terms, please do not use our website or purchase our products.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">2. What QA Hacks Provides</h2>

            <p className="mt-4">
              QA Hacks provides premade digital interview preparation products,
              including downloadable PDF guides, interview question packs,
              expert answer examples, bad answer examples, common mistakes, and
              speaking-style answer templates.
            </p>

            <p className="mt-4">
              Our products are designed for self-study and interview preparation
              for roles such as QA Lead, QA Manager, Manual QA Engineer,
              Automation QA Engineer, Software Tester, and Software Engineer.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              3. Premade Digital Products Only
            </h2>

            <p className="mt-4">
              QA Hacks sells premade digital products only. We do not currently
              offer consulting services, coaching calls, custom interview
              preparation, personalised services, recruitment services,
              certification programs, or job placement services.
            </p>

            <p className="mt-4">
              Purchasing a QA Hacks product gives you access to the specific
              digital material described on the product page. It does not include
              live support, one-on-one coaching, custom content creation, or
              personalised review unless clearly stated otherwise on the product
              page.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">4. Purchases and Payments</h2>

            <p className="mt-4">
              Products may be sold through third-party checkout and payment
              providers such as Lemon Squeezy or other platforms we use. By
              purchasing a product, you agree to provide accurate billing and
              contact information.
            </p>

            <p className="mt-4">
              Prices are displayed on the product page or checkout page before
              purchase. Prices may change at any time, but changes will not affect
              orders that have already been completed.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              5. Digital Delivery
            </h2>

            <p className="mt-4">
              After a successful purchase, customers will receive access to the
              purchased digital product through the delivery method described on
              the product page or checkout confirmation. This may include a
              download link, email delivery, or access instructions provided by
              the checkout platform.
            </p>

            <p className="mt-4">
              If you experience an issue accessing your product, please contact
              us at{" "}
              <a
                href="mailto:contact@qahacks.com"
                className="text-emerald-400 hover:underline"
              >
                contact@qahacks.com
              </a>{" "}
              and include your order email and product name.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              6. License and Permitted Use
            </h2>

            <p className="mt-4">
              When you purchase a QA Hacks digital product, you receive a limited,
              non-exclusive, non-transferable license to use the product for your
              personal interview preparation and self-study.
            </p>

            <p className="mt-4">You may not:</p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Resell, redistribute, upload, or share the product publicly.</li>
              <li>Copy the product and sell it as your own material.</li>
              <li>Use the product to create a competing paid product.</li>
              <li>Share download links, private files, or paid materials with others.</li>
              <li>Remove copyright notices, branding, or ownership information.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              7. Refunds
            </h2>

            <p className="mt-4">
              Because QA Hacks products are digital downloads, refund eligibility
              may be limited once a product has been delivered or accessed.
              Please review our{" "}
              <Link
                href="/refund-policy"
                className="text-emerald-400 hover:underline"
              >
                Refund Policy
              </Link>{" "}
              before purchasing.
            </p>

            <p className="mt-4">
              If you believe there is a problem with your purchase, please
              contact us and we will review your request according to our Refund
              Policy and the policies of our payment processor.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              8. Educational Purpose Only
            </h2>

            <p className="mt-4">
              QA Hacks products are educational resources created to help users
              prepare for interviews. We do not guarantee interview invitations,
              job offers, promotions, certifications, salary increases, or any
              specific career outcome.
            </p>

            <p className="mt-4">
              Users are responsible for how they study, adapt, and apply the
              materials during real interviews.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              9. Accuracy of Content
            </h2>

            <p className="mt-4">
              We make reasonable efforts to provide useful and practical
              interview preparation materials. However, interview expectations,
              hiring processes, technologies, and company requirements may vary.
            </p>

            <p className="mt-4">
              QA Hacks does not guarantee that all content will match every
              employer, interview style, job description, or hiring process.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              10. Intellectual Property
            </h2>

            <p className="mt-4">
              All content on QA Hacks, including website content, product
              descriptions, PDF guides, digital downloads, interview answers,
              designs, branding, and written materials, is owned by QA Hacks or
              used with permission.
            </p>

            <p className="mt-4">
              You may not copy, reproduce, distribute, modify, publish, sell, or
              exploit our content without prior written permission.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              11. Account, Access, and Abuse
            </h2>

            <p className="mt-4">
              We may restrict access to products, files, or services if we detect
              abuse, fraud, unauthorized sharing, payment disputes, chargeback
              abuse, or violation of these terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              12. Third-Party Services
            </h2>

            <p className="mt-4">
              QA Hacks may use third-party services for payments, hosting,
              analytics, email communication, product delivery, or website
              functionality. These services may have their own terms and privacy
              policies.
            </p>

            <p className="mt-4">
              We are not responsible for third-party websites, platforms, or
              services that we do not control.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              13. Limitation of Liability
            </h2>

            <p className="mt-4">
              To the maximum extent permitted by law, QA Hacks will not be liable
              for indirect, incidental, special, consequential, or punitive
              damages arising from your use of our website or products.
            </p>

            <p className="mt-4">
              Our products are provided on an “as is” and “as available” basis
              without warranties of any kind, unless otherwise required by law.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              14. Changes to These Terms
            </h2>

            <p className="mt-4">
              We may update these Terms of Service from time to time. When we
              make changes, we will update the “Last updated” date at the top of
              this page. Your continued use of the website after changes are
              posted means you accept the updated terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              15. Contact Us
            </h2>

            <p className="mt-4">
              If you have questions about these Terms of Service, please contact
              us:
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
              <Link
                href="/privacy-policy"
                className="text-emerald-400 hover:underline"
              >
                Privacy Policy
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