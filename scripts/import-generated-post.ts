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
};

const DATABASE_NAME = "qahacks-db";

// Default import vào remote D1.
// Nếu muốn test local: npm run import:post -- --local
const mode = process.argv.includes("--local") ? "--local" : "--remote";

function cleanText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function normalizeNullableText(value: unknown): string | null {
  const cleaned = cleanText(value);
  return cleaned.length > 0 ? cleaned : null;
}

function sqlValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "NULL";
  }

  const text = String(value).replace(/'/g, "''");
  return `'${text}'`;
}

function sqlJsonArray(value: unknown): string {
  if (!Array.isArray(value)) {
    return sqlValue(JSON.stringify([]));
  }

  const cleaned = value
    .map((item) => cleanText(item))
    .filter(Boolean);

  return sqlValue(JSON.stringify(cleaned));
}

function validatePost(post: GeneratedPost) {
  const missingFields: string[] = [];

  if (!cleanText(post.slug)) missingFields.push("slug");
  if (!cleanText(post.title)) missingFields.push("title");
  if (!cleanText(post.content)) missingFields.push("content");
  if (!cleanText(post.difficulty)) missingFields.push("difficulty");

  if (!Array.isArray(post.category) || post.category.length === 0) {
    missingFields.push("category");
  }

  if (!Array.isArray(post.target_role) || post.target_role.length === 0) {
    missingFields.push("target_role");
  }

  if (missingFields.length > 0) {
    throw new Error(
      `generated-post.json is missing required field(s): ${missingFields.join(", ")}`
    );
  }
}

function runWrangler(args: string[]) {
  execFileSync("npx", ["wrangler", ...args], {
    stdio: "inherit",
  });
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

  const toolStack = normalizeNullableText(post.tool_stack);
  const questionType = normalizeNullableText(post.question_type);
  const subCategory = normalizeNullableText(post.sub_category);

  const sql = `
-- Import generated QAHacks post.
-- Schema:
-- posts(id, slug, title, content, difficulty, category, target_role, created_at, tool_stack, question_type, sub_category, date, interview_source)

INSERT OR IGNORE INTO posts (
  id,
  slug,
  title,
  content,
  difficulty,
  category,
  target_role,
  tool_stack,
  question_type,
  sub_category,
  date,
  interview_source
) VALUES (
  ${sqlValue(slug)},
  ${sqlValue(slug)},
  ${sqlValue(title)},
  ${sqlValue(content)},
  ${sqlValue(difficulty)},
  ${sqlJsonArray(post.category)},
  ${sqlJsonArray(post.target_role)},
  ${sqlValue(toolStack)},
  ${sqlValue(questionType)},
  ${sqlValue(subCategory)},
  ${sqlValue(date)},
  ${sqlValue(normalizeNullableText(post.interview_source))}
);

SELECT changes() AS rows_inserted;

SELECT 
  id,
  slug,
  title,
  difficulty,
  category,
  target_role,
  tool_stack,
  question_type,
  sub_category,
  date
FROM posts
WHERE slug = ${sqlValue(slug)};
`;

  const sqlPath = path.join(process.cwd(), "tmp-import-generated-post.sql");

  fs.writeFileSync(sqlPath, sql, "utf-8");

  console.log("Importing generated post into D1...");
  console.log({
    database: DATABASE_NAME,
    mode,
    slug,
    title,
    difficulty,
    category: post.category,
    target_role: post.target_role,
    tool_stack: toolStack,
    question_type: questionType,
    sub_category: subCategory,
    interview_source: post.interview_source,
  });

  try {
    runWrangler([
      "d1",
      "execute",
      DATABASE_NAME,
      mode,
      "--file",
      sqlPath,
    ]);

    console.log("Import finished.");
    console.log("If rows_inserted = 1, the post was inserted.");
    console.log("If rows_inserted = 0, the slug already existed and was skipped.");
  } finally {
    if (fs.existsSync(sqlPath)) {
      fs.unlinkSync(sqlPath);
    }
  }
}

main();