import * as fs from "fs";
import * as path from "path";

async function fetchTopics() {
  const SHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE"; // Thay bằng ID của bạn
  const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

  try {
    console.log("📥 Đang tải dữ liệu từ Google Sheets...");
    const response = await fetch(URL);
    const text = await response.text();
    
    // Google Sheets trả về định dạng JSON hơi đặc biệt, cần xử lý để lấy dữ liệu thuần
    const json = JSON.parse(text.substring(47).slice(0, -2));
    
    const topics = json.table.rows.map((row: any) => ({
      topic: row.c[0]?.v || "",
      roles: row.c[1]?.v || "Automation_QA_Engineer",
      categories: row.c[2]?.v || "Technical",
      difficulty: row.c[3]?.v || "Advanced",
      status: row.c[4]?.v || "pending"
    }));

    fs.writeFileSync(
      path.join(process.cwd(), "topics.json"), 
      JSON.stringify(topics, null, 2), 
      "utf-8"
    );
    
    console.log(`✅ Đã tải ${topics.length} chủ đề về file topics.json`);
  } catch (error) {
    console.error("❌ Lỗi khi tải dữ liệu từ Google Sheets:", error);
  }
}

fetchTopics();