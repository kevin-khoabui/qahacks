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

// ============================================================================
// 🔥 HÀM CUỐN CHIẾU: TỰ ĐỘNG THỬ LẠI BẰNG KEY KHÁC NẾU FAIL
// ============================================================================
async function runTopicWithFallback(topic: string, startKeyIndex: number): Promise<{ success: boolean, nextKeyIndex: number }> {
  let currentKeyIndex = startKeyIndex;

  // Thử tối đa số lượng key hiện có (ví dụ 24 lần) cho 1 chủ đề
  for (let attempt = 0; attempt < TARGET_COUNT; attempt++) {
    console.log(`\n🚀 Đang nạp Key số ${currentKeyIndex}...`);

    let exitCode: number | null = null;
    await new Promise<void>((resolve) => {
      const child = spawn(
        "npx",
        ["tsx", "scripts/generate.ts", String(currentKeyIndex), topic],
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

    // Tính toán Key cho vòng lặp tiếp theo (nếu vượt quá TARGET_COUNT thì quay về 1)
    let nextKeyIndex = currentKeyIndex + 1;
    if (nextKeyIndex > TARGET_COUNT) {
      nextKeyIndex = 1;
    }

    // Nếu tạo bài mới thành công (0) hoặc bài đã tồn tại (2)
    if (exitCode === 0 || exitCode === 2) {
      console.log(`✅ Thành công! Topic này đã chốt xong bằng Key ${currentKeyIndex}.`);
      return { success: true, nextKeyIndex: nextKeyIndex }; // Trả về nextKeyIndex để topic sau dùng
    }

    // Nếu fail (ví dụ 503), tiếp tục vòng lặp để dùng key tiếp theo cho topic CŨ này
    console.warn(`⚠️ Key ${currentKeyIndex} thất bại (có thể do 503 limit). Xoay vòng sang Key ${nextKeyIndex} để thử lại ngay...`);
    currentKeyIndex = nextKeyIndex;
    await sleep(2000); // Nghỉ 2 giây trước khi thử Key mới
  }

  // Nếu chạy hết 24 keys mà vẫn fail
  return { success: false, nextKeyIndex: startKeyIndex };
}

// ============================================================================
// HÀM ĐIỀU PHỐI CHÍNH
// ============================================================================
async function runAll() {
  console.log(`\n==================================================`);
  console.log(`🔍 PHÁT HIỆN ${TARGET_COUNT}/${TARGET_COUNT} API KEYS HỢP LỆ CHO BÀI LẺ.`);
  console.log(`🚀 BẮT ĐẦU CHẠY MẺ TỔNG LỰC THEO CHIẾN THUẬT CUỐN CHIẾU...`);
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

  // Lấy ra số lượng bài tương ứng với số key cho mẻ này
  const topicsToProcess = validTopics.slice(0, TARGET_COUNT);
  const successfulTopics: string[] = [];
  
  // Biến lưu trữ Key hiện tại đang đứng ở đâu (Bắt đầu từ Key 1)
  let currentKeyPointer = 1;

  for (let i = 0; i < topicsToProcess.length; i++) {
    const targetTopic = topicsToProcess[i];
    console.log(`\n🔥 [Tiến độ bài viết: ${i + 1}/${topicsToProcess.length}]`);
    console.log(`👉 Chủ đề: ${targetTopic.substring(0, 60)}...`);

    // Gọi hàm cuốn chiếu
    const result = await runTopicWithFallback(targetTopic, currentKeyPointer);

    if (result.success) {
      successfulTopics.push(targetTopic);
      currentKeyPointer = result.nextKeyIndex; // Cập nhật lại súng để bắn topic tiếp theo
    } else {
      console.error(`\n❌ CHÍNH THỨC SẬP: Chủ đề này đã thử cạn kiệt ${TARGET_COUNT} Keys nhưng đều báo lỗi.`);
      console.error(`🛑 Tạm dừng toàn bộ mẻ chạy để bảo vệ hệ thống và chờ Google API phục hồi.`);
      break; // Dừng luôn mẻ chạy vì nếu 24 key đều lỗi, chứng tỏ mạng hoặc API có vấn đề nghiêm trọng
    }

    // Nghỉ ngơi giữa các Topic để tránh nghẽn
    if (i < topicsToProcess.length - 1) {
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