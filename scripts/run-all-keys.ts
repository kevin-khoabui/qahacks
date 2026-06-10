import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// Thu thập danh sách các API Key hợp lệ từ file cấu hình .env.local
const activeKeys = Object.keys(process.env).filter(
  (key) => 
    key.startsWith("GEMINI_API_KEY_") && 
    !key.endsWith("_25") && 
    process.env[key]?.trim() !== ""
);

const TARGET_COUNT = activeKeys.length;
const DELAY_MS = 3000; 

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runAll() {
  console.log(`\n==================================================`);
  console.log(`🔍 PHÁT HIỆN ${TARGET_COUNT}/24 API KEYS HỢP LỆ CHO BÀI LẺ.`);
  console.log(`🚀 BẮT ĐẦU CHẠY MẺ TỔNG LỰC ${TARGET_COUNT} BÀI...`);
  console.log(`==================================================\n`);
  
  if (TARGET_COUNT === 0) {
    console.log("❌ Lỗi: Không tìm thấy Key nào hợp lệ. Dừng hoạt động.");
    return;
  }

  // Tạo mảng để lưu vết trạng thái thành công/thất bại của từng lượt trong mẻ
  const runResults: { topic: string; success: boolean }[] = [];

  const filePath = path.join(process.cwd(), "topics.txt");
  if (!fs.existsSync(filePath)) {
    console.error("❌ Lỗi: Không tìm thấy file topics.txt!");
    return;
  }

  // Tách dòng chính xác theo ký tự xuống dòng (\n) để giữ nguyên vẹn câu dài
  const lines = fs.readFileSync(filePath, "utf-8").split(/\r?\n/).map(line => line.trim());
  const validTopics = lines.filter(line => line.length > 0);

  // Vòng lặp bắn đạn tịnh tiến: Key nào xử lý dòng nấy, không tranh chấp dòng đầu
  for (let i = 1; i <= TARGET_COUNT; i++) {
    if (i > validTopics.length) {
      console.log("🎉 Hết bài trong kho topics.txt để cấu hình lượt này.");
      break;
    }

    const targetTopic = validTopics[i - 1];
    console.log(`\n🔥 [Tiến độ: ${i}/${TARGET_COUNT}] Khởi động lượt bằng Key số ${i}...`);
    
    let isSuccess = false;
    await new Promise<void>((resolve) => {
      // 🛠️ SỬA LỖI CHIẾN LƯỢC: Bọc targetTopic bằng dấu nháy kép trốn thoát (\"...\") 
      // Việc này ép shell phải đọc toàn bộ câu dài chứa dấu cách làm 1 tham số duy nhất
      const child = spawn("npx", ["tsx", "scripts/generate.ts", String(i), `"${targetTopic}"`], { 
        stdio: "inherit", 
        shell: true 
      });

      child.on("close", (code) => {
        if (code === 0) isSuccess = true;
        resolve(); 
      });
    });

    runResults.push({ topic: targetTopic, success: isSuccess });

    if (i < TARGET_COUNT && i < validTopics.length) {
      await sleep(DELAY_MS);
    }
  }

  // ============================================================================
  // BƯỚC QUÉT DỌN CUỐI MẺ CHẠY: CHỈ XÓA NHỮNG DÒNG ĐÃ THÀNH CÔNG KHỎI TOPICS.TXT
  // ============================================================================
  console.log(`\n🧹 Đang tiến hành quét dọn và đồng bộ file topics.txt...`);
  const freshLines = fs.readFileSync(filePath, "utf-8").split(/\r?\n/).map(line => line.trim());
  
  const successfulTopics = runResults.filter(r => r.success).map(r => r.topic);
  const updatedLines = freshLines.filter(line => !successfulTopics.includes(line) && line.length > 0);
  
  fs.writeFileSync(filePath, updatedLines.join("\n"), "utf-8");
  console.log(`✅ Đã đồng bộ sạch sẽ! Đã cắt ${successfulTopics.length} dòng thành công. Còn lại: ${updatedLines.length} chủ đề.`);
  console.log(`\n🎉 HOÀN TẤT MẺ CHẠY CỦA GIỜ NÀY!`);
}

runAll();