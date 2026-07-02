import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config({ path: ".env.local" });

type GeneratedPost = {
  source_row_number: number;
  source_id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  difficulty: string;
  category: string[];
  target_role: string[];
  sub_category: string | null;
  question_type: string | null;
  tool_stack: string | null;
  tags: string[];
  date: string;
};

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const SHEET_TAB = process.env.GOOGLE_SHEET_TAB || "topics";

if (!SHEET_ID) {
  throw new Error("Missing GOOGLE_SHEET_ID in .env.local");
}

if (!SERVICE_ACCOUNT_EMAIL) {
  throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL in .env.local");
}

if (!PRIVATE_KEY) {
  throw new Error("Missing GOOGLE_PRIVATE_KEY in .env.local");
}

function cleanText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

async function main() {
  const postPath = path.join(process.cwd(), "generated-post.json");

  if (!fs.existsSync(postPath)) {
    throw new Error("generated-post.json not found. Run npm run generate:one first.");
  }

  const post = JSON.parse(fs.readFileSync(postPath, "utf-8")) as GeneratedPost;

  if (!post.source_row_number) {
    throw new Error("generated-post.json is missing source_row_number.");
  }

  if (!cleanText(post.slug)) {
    throw new Error("generated-post.json is missing slug.");
  }

  const auth = new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const rowNumber = post.source_row_number;
  const generatedAt = new Date().toISOString();

  /**
   * Google Sheet columns:
   * kejiyume@gmail.com
   * A id
   * B topic
   * C roles
   * D categories
   * E difficulty
   * F interview_source
   * G tool_stack
   * H question_type
   * I status
   * J slug
   * L generated_at
   * M error_message
   *
   * So we update A:M only.
   */

const range = `${SHEET_TAB}!J${rowNumber}:M${rowNumber}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values: [["generated", post.slug, generatedAt, ""]],
    },
  });

  console.log("Google Sheet updated successfully.");
  console.log({
    rowNumber,
    status: "generated",
    slug: post.slug,
    generated_at: generatedAt,
  });
}

main().catch((error) => {
  console.error("Failed to update Google Sheet:");
  console.error(error);
  process.exit(1);
});