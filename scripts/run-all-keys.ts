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
    
    let isSuccess = false;
    await new Promise<void>((resolve) => {
      // 🚀 GIẢI PHÁP AN TOÀN TUYỆT ĐỐI CHO LINUX/CI:
      // Gọi trực tiếp "node" kết hợp với loader của tsx qua đối số '--import' hoặc thông qua command thuần.
      // Tắt hoàn toàn 'shell: true' để chặn đứng lỗi diễn giải Pipe rác '|' của shell Linux.
      const child = spawn("node", ["--import", "tsx", "scripts/generate.ts", String(i), targetTopic], { 
        stdio: "inherit", 
        shell: false 
      });

      child.on("close", (code) => {
        if (code === 0) isSuccess = true;
        resolve(); 
      });
    });

    if (isSuccess) {
      // Lưu chính xác chuỗi gốc không dính nháy kép rác để phục vụ bộ lọc xóa dòng
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
    
    // Đọc lại trạng thái mới nhất của file phòng trường hợp bạn vừa edit tay lúc script đang chạy
    const freshLines = fs.readFileSync(filePath, "utf-8").split(/\r?\n/).map(line => line.trim());
    
    // Chỉ giữ lại những dòng KHÔNG nằm trong mảng đã tạo bài thành công
    const updatedLines = freshLines.filter(line => !successfulTopics.includes(line) && line.length > 0);
    
    // Ghi đè khóa cứng lại file tĩnh.
    fs.writeFileSync(filePath, updatedLines.join("\n"), "utf-8");
    console.log(`✅ Đã gọt dòng xong! Đã cắt sạch ${successfulTopics.length} chủ đề ra khỏi kho. Còn lại: ${updatedLines.length} chủ đề chờ mẻ tiếp theo.`);
  } else {
    console.log("\n⚠️ Không có chủ đề nào được xuất thành công trong mẻ này, giữ nguyên file topics.txt.");
  }

  console.log(`\n🎉 HOÀN TẤT MẺ CHẠY CỦA GIỜ NÀY!`);
}

runAll();