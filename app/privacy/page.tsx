import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | QA Hacks",
  description: "Privacy Policy and data protection guidelines for QA Hacks. Learn how we handle information and use cookies.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Privacy Policy</h1>
          <p className="mt-2 text-xs text-slate-400">Last updated: June 15, 2026</p>
        </div>

        <div className="space-y-6 text-slate-300 leading-relaxed text-xs">
          <p>
            At QA Hacks, accessible from https://qahacks.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by QA Hacks and how we use it.
          </p>

          <h2 className="text-lg font-bold text-white pt-2">Log Files</h2>
          <p>
            QA Hacks follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services&apos; analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
          </p>

          {/* KHỐI ÉP PHẢI CÓ ĐỂ XIN ADSENSE */}
          <h2 className="text-lg font-bold text-white pt-2">Google DoubleClick DART Cookie</h2>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">https://policies.google.com/technologies/ads</a>
          </p>

          <h2 className="text-lg font-bold text-white pt-2">Our Advertising Partners</h2>
          <p>
            Some of advertisers on our site may use cookies and web beacons. Our advertising partners include Google AdSense. Each of our advertising partners has their own Privacy Policy for their policies on user data.
          </p>

          <h2 className="text-lg font-bold text-white pt-2">Privacy Policies</h2>
          <p>
            Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on QA Hacks, which are sent directly to users&apos; browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
          </p>

          <h2 className="text-lg font-bold text-white pt-2">Children&apos;s Information</h2>
          <p>
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. QA Hacks does not knowingly collect any Personal Identifiable Information from children under the age of 13.
          </p>

          <h2 className="text-lg font-bold text-white pt-2">Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
          </p>
        </div>
      </article>
    </main>
  );
}