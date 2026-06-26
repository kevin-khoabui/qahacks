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

const TARGET_COUNT = activeKeys.length; // Số lượng Key tối đa (VD: 24)
const DELAY_MS = 3000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================================
// HÀM ĐIỀU PHỐI CHÍNH
// ============================================================================
async function runAll() {
  console.log(`\n==================================================`);
  console.log(`🔍 PHÁT HIỆN ${TARGET_COUNT} API KEYS HỢP LỆ.`);
  console.log(`🚀 BẮT ĐẦU MẺ CHẠY (TỐI ĐA SỬ DỤNG ${TARGET_COUNT} KEYS)...`);
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

  // Lọc lấy danh sách chủ đề sạch
  const lines = fs.readFileSync(filePath, "utf-8").split(/\r?\n/).map(line => line.trim());
  const validTopics = lines.filter(line => line.length > 0);

  if (validTopics.length === 0) {
    console.log("🎉 Hết bài trong kho topics.txt để cấu hình lượt này.");
    return;
  }

  const successfulTopics: string[] = [];
  
  // Biến duy nhất kiểm soát súng: Bắn từ viên số 1 đến viên cuối cùng (24) rồi nghỉ.
  let currentKeyIndex = 1;

  for (let i = 0; i < validTopics.length; i++) {
    // Nếu đã dùng hết số Key quy định, lập tức ngắt toàn bộ vòng lặp
    if (currentKeyIndex > TARGET_COUNT) {
      console.log(`\n🛑 Đã sử dụng đến Key cuối cùng (Key ${TARGET_COUNT}). Dừng mẻ chạy tại đây!`);
      break;
    }

    const targetTopic = validTopics[i];
    console.log(`\n🔥 [Tiến độ bài viết: ${i + 1}/${validTopics.length}]`);
    console.log(`👉 Chủ đề: ${targetTopic.substring(0, 60)}...`);

    let topicSuccess = false;

    // Vòng lặp thử Key cho chủ đề hiện tại
    while (currentKeyIndex <= TARGET_COUNT) {
      console.log(`🚀 Đang nạp Key số ${currentKeyIndex}...`);

      let exitCode: number | null = null;
      await new Promise<void>((resolve) => {
        const child = spawn(
          "npx",
          ["tsx", "scripts/generate.ts", String(currentKeyIndex), targetTopic],
          {
            stdio: "inherit",
            shell: false
          }
        );

        child.on("close", (code) => {
          exitCode = code;
          resolve();
        });
      });

      // Nếu tạo bài mới thành công (0) hoặc bài đã tồn tại (2)
      if (exitCode === 0 || exitCode === 2) {
        console.log(`✅ Thành công! Topic này đã chốt xong bằng Key ${currentKeyIndex}.`);
        successfulTopics.push(targetTopic);
        topicSuccess = true;
        currentKeyIndex++; // Chuyển sang Key tiếp theo cho chủ đề kế tiếp
        break; // Thoát vòng lặp while, đi tới bài tiếp theo
      }

      // Nếu Key hiện tại thất bại (VD: 503)
      console.warn(`⚠️ Key ${currentKeyIndex} thất bại (có thể do 503 limit). Bỏ Key này, chuyển sang Key tiếp theo...`);
      currentKeyIndex++; // Nhảy thẳng sang Key tiếp theo để thử lại topic này
      
      // Nghỉ 2 giây trước khi thử Key mới (trừ khi đã hết Key)
      if (currentKeyIndex <= TARGET_COUNT) {
        await sleep(2000); 
      }
    }

    // Nếu topic này vẫn chưa xong mà đã cạn kiệt toàn bộ Key
    if (!topicSuccess && currentKeyIndex > TARGET_COUNT) {
      console.log(`\n❌ Topic này chưa hoàn thành nhưng đã cạn kiệt toàn bộ kho Key. Ngừng mẻ chạy.`);
      break;
    }

    // Nghỉ ngơi giữa các Topic để tránh nghẽn, miễn là vẫn còn Key
    if (i < validTopics.length - 1 && currentKeyIndex <= TARGET_COUNT) {
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