import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// 1. Nạp file .env.local để đếm số lượng Key hiện có
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// 2. Tự động quét tìm tất cả các biến có chữ GEMINI_API_KEY và không bị rỗng
const activeKeys = Object.keys(process.env).filter(
  (key) => key.startsWith("GEMINI_API_KEY") && process.env[key]?.trim() !== ""
);

const TARGET_COUNT = activeKeys.length;
const DELAY_MS = 15000; // Nghỉ 15 giây giữa mỗi bài để an toàn

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runAll() {
  console.log(`\n==================================================`);
  console.log(`🔍 PHÁT HIỆN ${TARGET_COUNT} API KEYS HỢP LỆ TRONG HỆ THỐNG.`);
  console.log(`🚀 BẮT ĐẦU CHẠY MẺ ${TARGET_COUNT} BÀI VIẾT CHO GIỜ NÀY...\n`);
  
  if (TARGET_COUNT === 0) {
    console.log("❌ Lỗi: Không tìm thấy Key nào trong .env.local. Dừng hoạt động.");
    return;
  }

  for (let i = 1; i <= TARGET_COUNT; i++) {
    console.log(`\n🔥 [Tiến độ: ${i}/${TARGET_COUNT}] Đang gọi AI cào bài viết mới...`);
    
    await new Promise<void>((resolve) => {
      const child = spawn("npm", ["run", "gen:single"], { 
        stdio: "inherit", 
        shell: true 
      });

      child.on("close", (code) => {
        resolve(); 
      });
    });

    if (i < TARGET_COUNT) {
      console.log(`\n💤 Tạm nghỉ ${DELAY_MS / 1000} giây để làm mát hệ thống (Chống Rate Limit)...`);
      await sleep(DELAY_MS);
    }
  }
  
  console.log(`\n🎉 HOÀN TẤT MẺ CHẠY CỦA GIỜ NÀY! ĐÃ BƠM XONG ${TARGET_COUNT} BÀI VÀO DATABASE.`);
}

runAll();