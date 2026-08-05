import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

type Post = {
  slug: string;
  title: string;
  content?: string;
  difficulty?: string;
  tool_stack?: string;
  date?: string;
};

const remote = process.argv.includes("--remote");
const database = "qahacks-db";

function normalizeQuestion(value: string) {
  return value
    .toLowerCase()
    .replace(/\b(describe|explain|discuss|how do you|how would you|what is|what are|tell me about)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function scorePost(post: Post) {
  const content = post.content || "";
  let score = 100;
  if (content.length < 2500) score -= 25;
  if (content.length < 1400) score -= 25;
  if (!content.includes("### Expert Answer:")) score -= 20;
  if (!content.includes("### Speaking Blueprint:")) score -= 15;
  if (!content.includes("### Common Mistakes:")) score -= 10;
  if (!post.tool_stack || /generic|general/i.test(post.tool_stack)) score -= 5;
  return Math.max(0, score);
}

function main() {
  const args = [
    "wrangler",
    "d1",
    "execute",
    database,
    remote ? "--remote" : "--local",
    "--command",
    "SELECT slug, title, content, difficulty, tool_stack, date FROM posts ORDER BY title ASC",
    "--json",
  ];

  const raw = execFileSync("npx", args, { encoding: "utf-8" });
  const parsed = JSON.parse(raw);
  const posts: Post[] = parsed?.[0]?.results || parsed?.results || [];

  const groups = new Map<string, Post[]>();
  for (const post of posts) {
    const fingerprint = normalizeQuestion(post.title);
    const items = groups.get(fingerprint) || [];
    items.push(post);
    groups.set(fingerprint, items);
  }

  const duplicates = [...groups.entries()]
    .filter(([, items]) => items.length > 1)
    .map(([fingerprint, items]) => ({ fingerprint, items }));

  const lowQuality = posts
    .map((post) => ({ ...post, quality_score: scorePost(post), fingerprint: normalizeQuestion(post.title) }))
    .filter((post) => post.quality_score < 75)
    .sort((a, b) => a.quality_score - b.quality_score);

  const report = {
    generated_at: new Date().toISOString(),
    source: remote ? "remote" : "local",
    total_posts: posts.length,
    duplicate_groups: duplicates.length,
    duplicate_posts: duplicates.reduce((sum, group) => sum + group.items.length, 0),
    low_quality_posts: lowQuality.length,
    duplicates,
    lowQuality,
  };

  const reportDir = path.join(process.cwd(), "reports");
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, "content-audit.json"), JSON.stringify(report, null, 2));

  const candidateSlugs = new Set<string>();
  for (const group of duplicates) {
    group.items.slice(1).forEach((post) => candidateSlugs.add(post.slug));
  }
  lowQuality.filter((post) => post.quality_score < 50).forEach((post) => candidateSlugs.add(post.slug));

  const sql = [
    "-- Review this file before running it.",
    "-- It archives candidates instead of deleting them.",
    ...[...candidateSlugs].map((slug) =>
      `UPDATE posts SET status = 'archived', reviewed_at = datetime('now') WHERE slug = '${slug.replace(/'/g, "''")}';`
    ),
  ].join("\n");

  fs.writeFileSync(path.join(reportDir, "archive-candidates.sql"), sql + "\n");
  console.log(`Audited ${posts.length} posts.`);
  console.log(`Duplicate groups: ${duplicates.length}`);
  console.log(`Low-quality candidates: ${lowQuality.length}`);
  console.log("Review reports/content-audit.json and reports/archive-candidates.sql.");
}

main();
