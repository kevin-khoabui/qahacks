import HomePageClient from "./HomePageClient";

export const metadata = {
  title: "QA Hacks | Master Software Testing & Interview Guides",
  description: "Comprehensive QA interview questions, automation testing tutorials, and career blueprints for Manual, Automation, and QA Lead positions.",
  keywords: [
    "QA interview", "software testing", "automation testing", "Cypress", "Playwright", "QA Hacks",
    "software engineer", "developer testing", "QA Lead interview", "test automation engineer"
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "QA Hacks",
            "url": "https://qahacks.com/",
            "description": "Master software testing and ace your QA interviews with our expert blueprints."
          }),
        }}
      />
      <HomePageClient />
    </>
  );
}