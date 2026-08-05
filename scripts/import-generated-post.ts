import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

type GeneratedPost = {
  source_row_number?: number;
  source_id?: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  difficulty: string;
  category: string[];
  target_role: string[];
  sub_category: string | null;
  question_type: string | null;
  tool_stack: string | null;
  tags?: string[];
  date: string;
  interview_source: string | null;
  quality_score?: number;
  question_fingerprint?: string;
};

const DATABASE_NAME = "qahacks-db";
const remote = process.argv.includes("--remote");
const mode = remote ? "--remote" : "--local";

if (remote && !process.argv.includes("--confirm")) {
  throw new Error("Remote import requires both --remote and --confirm.");
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNullableText(value: unknown): string | null {
  const cleaned = cleanText(value);
  return cleaned.length > 0 ? cleaned : null;
}

function fingerprintQuestion(value: string) {
  return value
    .toLowerCase()
    .replace(/\b(describe|explain|discuss|how do you|how would you|what is|what are|tell me about)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function sqlValue(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlJsonArray(value: unknown): string {
  const cleaned = Array.isArray(value)
    ? value.map((item) => cleanText(item)).filter(Boolean)
    : [];
  return sqlValue(JSON.stringify(cleaned));
}

function validatePost(post: GeneratedPost) {
  const missingFields: string[] = [];
  if (!cleanText(post.slug)) missingFields.push("slug");
  if (!cleanText(post.title)) missingFields.push("title");
  if (!cleanText(post.content)) missingFields.push("content");
  if (!cleanText(post.difficulty)) missingFields.push("difficulty");
  if (!Array.isArray(post.category) || post.category.length === 0) missingFields.push("category");
  if (!Array.isArray(post.target_role) || post.target_role.length === 0) missingFields.push("target_role");
  if (missingFields.length > 0) {
    throw new Error(`generated-post.json is missing required field(s): ${missingFields.join(", ")}`);
  }
}

function runWrangler(args: string[]) {
  execFileSync("npx", ["wrangler", ...args], { stdio: "inherit" });
}

function main() {
  const postPath = path.join(process.cwd(), "generated-post.json");
  if (!fs.existsSync(postPath)) {
    throw new Error("generated-post.json not found. Run npm run generate:one first.");
  }

  const post = JSON.parse(fs.readFileSync(postPath, "utf-8")) as GeneratedPost;
  validatePost(post);

  const slug = cleanText(post.slug);
  const title = cleanText(post.title);
  const content = cleanText(post.content);
  const difficulty = cleanText(post.difficulty);
  const date = cleanText(post.date) || new Date().toISOString();
  const qualityScore = Number.isFinite(post.quality_score) ? Number(post.quality_score) : null;
  const fingerprint = cleanText(post.question_fingerprint) || fingerprintQuestion(title);

  const sql = `
INSERT OR IGNORE INTO posts (
  id, slug, title, content, difficulty, category, target_role,
  tool_stack, question_type, sub_category, date, interview_source,
  status, quality_score, question_fingerprint
) VALUES (
  ${sqlValue(slug)}, ${sqlValue(slug)}, ${sqlValue(title)}, ${sqlValue(content)},
  ${sqlValue(difficulty)}, ${sqlJsonArray(post.category)}, ${sqlJsonArray(post.target_role)},
  ${sqlValue(normalizeNullableText(post.tool_stack))},
  ${sqlValue(normalizeNullableText(post.question_type))},
  ${sqlValue(normalizeNullableText(post.sub_category))},
  ${sqlValue(date)}, ${sqlValue(normalizeNullableText(post.interview_source))},
  'draft', ${qualityScore === null ? "NULL" : qualityScore}, ${sqlValue(fingerprint)}
);
SELECT changes() AS rows_inserted;
`;

  const sqlPath = path.join(process.cwd(), "tmp-import-generated-post.sql");
  fs.writeFileSync(sqlPath, sql, "utf-8");

  console.log(`Importing generated post into ${remote ? "REMOTE" : "LOCAL"} D1 as draft.`);
  try {
    runWrangler(["d1", "execute", DATABASE_NAME, mode, "--file", sqlPath]);
  } finally {
    if (fs.existsSync(sqlPath)) fs.unlinkSync(sqlPath);
  }
}

main();
