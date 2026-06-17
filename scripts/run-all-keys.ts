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

  const filePath = path.join(process.cwd(), "topics.txt");
  if (!fs.existsSync(filePath)) {
    console.error("❌ Lỗi: Không tìm thấy file topics.txt!");
    return;
  }

  // Tạo mảng lưu vết các dòng đã xử lý thành công để gọt bỏ cuối mẻ
  const successfulTopics: string[] = [];

  // Vòng lặp bắn đạn tịnh tiến: Key nào xử lý dòng nấy
  for (let i = 1; i <= TARGET_COUNT; i++) {
    // Đọc lại file liên tục ở mỗi vòng lặp để cập nhật kho bài viết mới nhất
    const lines = fs.readFileSync(filePath, "utf-8").split(/\r?\n/).map(line => line.trim());
    const validTopics = lines.filter(line => line.length > 0);

    if (validTopics.length === 0 || (i - 1) >= validTopics.length) {
      console.log("🎉 Hết bài trong kho topics.txt để cấu hình lượt này.");
      break;
    }

    const targetTopic = validTopics[i - 1];
    console.log(`\n🔥 [Tiến độ: ${i}/${TARGET_COUNT}] Khởi động lượt bằng Key số ${i}...`);

let exitCode: number | null = null;
    await new Promise<void>((resolve) => {
      // 🚀 GIẢI PHÁP ĐƯỜNG DẪN LOADER TUYỆT ĐỐI CHUẨN NATIVE ESM:
      // Tìm chính xác file cấu hình export của gói tsx trong node_modules cục bộ.
      // Việc truyền đường dẫn file vật lý này giúp câu lệnh "node --import" tìm thấy loader ngay lập tức
      // mà không phụ thuộc vào cơ chế phân giải package tự động của hệ điều hành CI.
      const tsxLoaderPath = path.join(process.cwd(), "node_modules", "tsx", "dist", "index.js");

      const child = spawn(
        process.execPath, 
        ["--import", tsxLoaderPath, "scripts/generate.ts", String(i), targetTopic], 
        { 
          stdio: "inherit", 
          shell: false // Khóa chặt false để Linux không bao giờ phá hỏng chuỗi chứa dấu "|"
        }
      );

      child.on("close", (code) => {
        exitCode = code;
        resolve(); 
      });
    });

    // Code 0: Thành công tạo mới | Code 2: Bị trùng lặp nhưng vẫn gọt dòng an toàn
    if (exitCode === 0 || exitCode === 2) {
      successfulTopics.push(targetTopic);
    }

    if (i < TARGET_COUNT && i < validTopics.length) {
      await sleep(DELAY_MS);
    }
  }

  // ============================================================================
  // 🔥 BỘ LỌC XÓA DÒNG TUYỆT ĐỐI: ĐỒNG BỘ SẠCH SẼ LẠI FILE TOPICS.TXT
  // ============================================================================
  if (successfulTopics.length > 0) {
    console.log(`\n🧹 Đang tiến hành quét dọn và gọt bỏ các dòng thành công khỏi topics.txt...`);

    const freshLines = fs.readFileSync(filePath, "utf-8").split(/\r?\n/).map(line => line.trim());
    const updatedLines = freshLines.filter(line => !successfulTopics.includes(line) && line.length > 0);

    fs.writeFileSync(filePath, updatedLines.join("\n"), "utf-8");
    console.log(`✅ Đã gọt dòng xong! Đã cắt sạch ${successfulTopics.length} chủ đề ra khỏi kho. Còn lại: ${updatedLines.length} chủ đề chờ mẻ tiếp theo.`);
  } else {
    console.log("\n⚠️ Không có chủ đề nào được xuất thành công trong mẻ này, giữ nguyên file topics.txt.");
  }

  console.log(`\n🎉 HOÀN TẤT MẺ CHẠY CỦA GIỜ NÀY!`);
}

runAll();