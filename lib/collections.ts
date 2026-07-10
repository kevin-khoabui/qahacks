export type CollectionRule = {
  roles?: string[];
  categories?: string[];
  tools?: string[];
  questionTypes?: string[];
  titleIncludes?: string[];
};

export type InterviewCollection = {
  slug: string;
  title: string;
  description: string;
  badge: string;
  href: string;
  rule: CollectionRule;
};

export const INTERVIEW_COLLECTIONS: InterviewCollection[] = [
  {
    slug: "qa-lead-interview",
    title: "QA Lead Interview",
    description: "Leadership, strategy, risk, release quality, and team communication questions.",
    badge: "Leadership",
    href: "/collections/qa-lead-interview",
    rule: {
      roles: ["QA_Leader"],
      titleIncludes: ["lead", "strategy", "risk", "release", "stakeholder", "team"],
    },
  },
  {
    slug: "manual-qa-interview",
    title: "Manual QA Interview",
    description: "Core manual testing, bug reporting, test design, and real-world QA scenarios.",
    badge: "Manual QA",
    href: "/collections/manual-qa-interview",
    rule: {
      roles: ["Manual_QA_Engineer"],
      titleIncludes: ["bug", "test case", "regression", "exploratory", "defect"],
    },
  },
  {
    slug: "automation-qa-interview",
    title: "Automation QA Interview",
    description: "Automation strategy, framework design, flaky tests, CI, and maintainability.",
    badge: "Automation",
    href: "/collections/automation-qa-interview",
    rule: {
      roles: ["Automation_QA_Engineer"],
      titleIncludes: ["automation", "framework", "flaky", "ci", "maintain"],
    },
  },
  {
    slug: "playwright-interview",
    title: "Playwright Interview",
    description: "Playwright testing, locators, fixtures, browser contexts, and test architecture.",
    badge: "Playwright",
    href: "/collections/playwright-interview",
    rule: {
      tools: ["Playwright"],
    },
  },
  {
    slug: "cypress-interview",
    title: "Cypress Interview",
    description: "Cypress fundamentals, test structure, selectors, waits, and debugging questions.",
    badge: "Cypress",
    href: "/collections/cypress-interview",
    rule: {
      tools: ["Cypress"],
    },
  },
  {
    slug: "api-testing-interview",
    title: "API Testing Interview",
    description: "API validation, status codes, contract testing, Postman, and backend test coverage.",
    badge: "API",
    href: "/collections/api-testing-interview",
    rule: {
      tools: ["Postman"],
      titleIncludes: ["api", "endpoint", "status code", "contract", "payload"],
    },
  },
  {
    slug: "behavioral-interview",
    title: "Behavioral Interview",
    description: "Communication, conflict, ownership, ambiguity, and stakeholder management.",
    badge: "Behavioral",
    href: "/collections/behavioral-interview",
    rule: {
      titleIncludes: ["conflict", "stakeholder", "ownership", "ambiguity", "communication"],
    },
  },
  {
    slug: "debugging-problem-solving",
    title: "Debugging & Problem Solving",
    description: "Root cause analysis, investigation, logs, reproduction, and troubleshooting.",
    badge: "Debugging",
    href: "/collections/debugging-problem-solving",
    rule: {
      titleIncludes: ["debug", "root cause", "investigate", "reproduce", "troubleshoot", "logs"],
    },
  },
];

export function getCollectionBySlug(slug: string) {
  return INTERVIEW_COLLECTIONS.find((collection) => collection.slug === slug) || null;
}