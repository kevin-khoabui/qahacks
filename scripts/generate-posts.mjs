import fs from "fs";
import path from "path";
import matter from "gray-matter";

// 🔥 QUY HOẠCH MỘT CỔNG: Chỉ quét duy nhất thư mục posts gốc để đồng bộ 100% hệ thống
const postsFolder = path.resolve(process.cwd(), "content", "posts");

// FILE ĐẦU RA JSON TRONG PUBLIC
const jsonResultFile = path.resolve(process.cwd(), "public", "content", "posts.generated.json");

const outputDir = path.dirname(jsonResultFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const allGeneratedItems = [];

// --- HÀM QUÉT THƯ MỤC BÀI VIẾT GỐC ---
if (fs.existsSync(postsFolder)) {
  fs.readdirSync(postsFolder)
    .filter((fileName) => fileName.endsWith(".md"))
    .forEach((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsFolder, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      // Đẩy bài viết vào kho lưu trữ JSON tổng
      allGeneratedItems.push({
        slug,
        content,
        ...data,
        // Giữ nguyên thuộc tính để Next.js điều hướng và hiển thị mượt mà không bị ẩn bài
        question_type: data.question_type || "Single", 
      });
    });
}

// Ghi toàn bộ danh sách đã phân loại vào file JSON tổng
fs.writeFileSync(jsonResultFile, JSON.stringify(allGeneratedItems, null, 2), "utf8");
console.log(`\n📊 [ĐỒNG BỘ STATIC OK] Đã gom tổng cộng ${allGeneratedItems.length} bài viết từ thư mục posts vào file posts.generated.json!`);