import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

const DATABASE_NAME = "qahacks-db";
const mode = process.argv.includes("--local") ? "--local" : "--remote";

type Rule = {
  topic: string;
  priority: number;
  featured?: number;
  keywords: string[];
};

const rules: Rule[] = [
  {
    topic: "release_readiness",
    priority: 1,
    featured: 1,
    keywords: ["release", "deployment", "production readiness", "go/no-go", "readiness"],
  },
  {
    topic: "risk_management",
    priority: 1,
    featured: 1,
    keywords: ["risk", "impact", "critical defects", "business continuity"],
  },
  {
    topic: "quality_metrics",
    priority: 2,
    keywords: ["metrics", "defect leakage", "quality goals", "testing effectiveness"],
  },
  {
    topic: "stakeholder_management",
    priority: 2,
    keywords: ["stakeholder", "conflict", "disagreement", "communication"],
  },
  {
    topic: "team_leadership",
    priority: 2,
    keywords: ["team", "burnout", "engagement", "leadership"],
  },
  {
    topic: "bug_reporting",
    priority: 1,
    featured: 1,
    keywords: ["bug report", "defect", "reproduce", "reproduction", "logs"],
  },
  {
    topic: "regression_testing",
    priority: 1,
    featured: 1,
    keywords: ["regression", "refactoring", "change impact"],
  },
  {
    topic: "exploratory_testing",
    priority: 2,
    keywords: ["exploratory"],
  },
  {
    topic: "api_testing",
    priority: 2,
    keywords: ["api", "postman", "endpoint", "payload", "contract"],
  },
  {
    topic: "framework_design",
    priority: 1,
    featured: 1,
    keywords: ["framework", "architecture", "toolchain"],
  },
  {
    topic: "playwright",
    priority: 1,
    featured: 1,
    keywords: ["playwright", "fixture", "browser context"],
  },
  {
    topic: "cypress",
    priority: 1,
    featured: 1,
    keywords: ["cypress"],
  },
  {
    topic: "ci_cd",
    priority: 2,
    keywords: ["ci", "github actions", "pipeline"],
  },
  {
    topic: "flaky_tests",
    priority: 1,
    featured: 1,
    keywords: ["flaky", "stability", "unstable"],
  },
  {
    topic: "test_data",
    priority: 2,
    keywords: ["test data", "data migration", "large data", "bulk data"],
  },
  {
    topic: "mocking",
    priority: 2,
    keywords: ["mock", "mocking", "stub"],
  },
];

function sqlValue(value: unknown) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function classify(title: string) {
  const normalized = title.toLowerCase();

  for (const rule of rules) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword.toLowerCase()))) {
      return {
        topic: rule.topic,
        priority: rule.priority,
        featured: rule.featured || 0,
      };
    }
  }

  return {
    topic: "general_interview",
    priority: 3,
    featured: 0,
  };
}

function runWrangler(args: string[]) {
  execFileSync("npx", ["wrangler", ...args], {
    stdio: "inherit",
  });
}

function main() {
  const postsPath = path.join(process.cwd(), "posts.json");

  if (!fs.existsSync(postsPath)) {
    throw new Error("posts.json not found. Put exported posts.json in project root first.");
  }

  const raw = JSON.parse(fs.readFileSync(postsPath, "utf-8"));
  const posts = raw[0]?.results || raw.results || raw;

  if (!Array.isArray(posts)) {
    throw new Error("Could not read posts array from posts.json.");
  }

  const updates = posts.map((post: any) => {
    const result = classify(post.title || "");

    return `
UPDATE posts
SET
  topic = ${sqlValue(result.topic)},
  priority = ${result.priority},
  featured = ${result.featured}
WHERE slug = ${sqlValue(post.slug)};
`;
  });

  const sql = updates.join("\n");

  const outputPath = path.join(process.cwd(), "tmp-classify-post-topics.sql");
  fs.writeFileSync(outputPath, sql, "utf-8");

  console.log(`Generated ${updates.length} updates.`);
  console.log(`SQL file: ${outputPath}`);
  console.log("Running update...");

  try {
    runWrangler([
      "d1",
      "execute",
      DATABASE_NAME,
      mode,
      "--file",
      outputPath,
    ]);
  } finally {
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  }

  console.log("Done.");
}

main();