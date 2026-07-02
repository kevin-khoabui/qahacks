import fs from "fs";
import path from "path";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

type TopicRow = {
  rowNumber: number;
  id: string;
  topic: string;
  roles: string;
  categories: string;
  difficulty: string;
  tool_stack: string;
  question_type: string;
  sub_category: string;
  status: string;
  slug: string;
  generated_at: string;
  error_message: string;
  interview_source: string;
};

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const SHEET_TAB = process.env.GOOGLE_SHEET_TAB || "topics";

if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID in .env.local");
if (!SERVICE_ACCOUNT_EMAIL) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL in .env.local");
if (!PRIVATE_KEY) throw new Error("Missing GOOGLE_PRIVATE_KEY in .env.local");

function getCell(row: string[], headers: string[], key: string) {
  const index = headers.indexOf(key);
  if (index === -1) return "";
  return row[index]?.trim() || "";
}

async function main() {
  const auth = new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_TAB}!A:L`,
  });

  const rows = response.data.values || [];

  if (rows.length <= 1) {
    console.log("No rows found.");
    return;
  }

  const headers = rows[0].map((header) => header.trim());

  const pendingTopics: TopicRow[] = rows
    .slice(1)
    .map((row, index) => {
      return {
        rowNumber: index + 2,
        id: getCell(row, headers, "id"),
        topic: getCell(row, headers, "topic"),
        roles: getCell(row, headers, "roles"),
        categories: getCell(row, headers, "categories"),
        difficulty: getCell(row, headers, "difficulty"),
        tool_stack: getCell(row, headers, "tool_stack"),
        question_type: getCell(row, headers, "question_type"),
        sub_category: getCell(row, headers, "sub_category"),
        status: getCell(row, headers, "status"),
        slug: getCell(row, headers, "slug"),
        generated_at: getCell(row, headers, "generated_at"),
        error_message: getCell(row, headers, "error_message"),
        interview_source: getCell(row, headers, "interview_source"),
      };
    })
    .filter((item) => item.status.toLowerCase() === "pending" && item.topic);

  const outputPath = path.join(process.cwd(), "topics.json");

  fs.writeFileSync(outputPath, JSON.stringify(pendingTopics, null, 2), "utf-8");

  console.log(`Found ${pendingTopics.length} pending topic(s).`);
  console.log(`Saved to ${outputPath}`);

  if (pendingTopics.length > 0) {
    console.log("First pending topic:");
    console.log(pendingTopics[0]);
  }
}

main().catch((error) => {
  console.error("Failed to fetch pending topics:");
  console.error(error);
  process.exit(1);
});