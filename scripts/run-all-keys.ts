import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const activeKeys = Object.keys(process.env).filter(
  (key) => key.startsWith("GEMINI_API_KEY_") && process.env[key]?.trim() !== ""
);

const TARGET_COUNT = activeKeys.length;
const DELAY_MS = 3000;
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runAll() {
  const filePath = path.join(process.cwd(), "topics.json"); // ĐÃ THÊM: Định nghĩa filePath

  // 1. Chạy script fetch dữ liệu từ Google Sheets
  console.log("🔄 Đang đồng bộ Google Sheets...");
  await new Promise<void>((resolve) => {
    const child = spawn("npx", ["tsx", "scripts/fetch-topics.ts"], { stdio: "inherit" });
    child.on("close", () => resolve());
  });

  // 2. Đọc và lọc các bài chưa làm
  if (!fs.existsSync(filePath)) {
    console.error("❌ Lỗi: Không tìm thấy file topics.json!");
    return;
  }

  let topics = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  let pendingTopics = topics.filter((t: any) => t.status === "pending");

  if (pendingTopics.length === 0) {
    console.log("🎉 Không có bài nào ở trạng thái pending.");
    return;
  }

  console.log(`\n==================================================`);
  console.log(`🔍 PHÁT HIỆN ${TARGET_COUNT} API KEYS. CÓ ${pendingTopics.length} BÀI PENDING.`);
  console.log(`==================================================\n`);

  let currentKeyIndex = 1;

  for (let i = 0; i < pendingTopics.length; i++) {
    if (currentKeyIndex > TARGET_COUNT) {
        console.log("🛑 Đã dùng hết API Key hiện có.");
        break;
    }

    const item = pendingTopics[i];
    const metadataArg = `${item.roles}|${item.categories}|${item.difficulty}|${item.topic}`;

    console.log(`\n🔥 [Tiến độ: ${i + 1}/${pendingTopics.length}]`);
    console.log(`👉 Chủ đề: ${item.topic.substring(0, 50)}...`);

    let exitCode: number | null = null;
    await new Promise<void>((resolve) => {
      const child = spawn("npx", ["tsx", "scripts/generate.ts", String(currentKeyIndex), metadataArg], {
        stdio: "inherit",
        shell: false
      });
      child.on("close", (code) => { exitCode = code; resolve(); });
    });

    if (exitCode === 0 || exitCode === 2) {
      item.status = "done";
      console.log(`✅ Thành công.`);
    } else {
      item.status = "error";
      console.log(`⚠️ Thất bại, bài viết này được đánh dấu lỗi.`);
    }

    // Ghi đè file JSON để lưu trạng thái
    fs.writeFileSync(filePath, JSON.stringify(topics, null, 2), "utf-8");

    currentKeyIndex++;
    if (i < pendingTopics.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\n🎉 HOÀN TẤT MẺ CHẠY!`);
}

runAll();