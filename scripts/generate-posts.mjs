import fs from "fs";
import path from "path";
import matter from "gray-matter";

// 1. Chỉ đúng vào thư mục public nơi đống file .md đang ẩn nấp
const targetFolder = path.resolve(process.cwd(), "public", "content", "posts");
const jsonResultFile = path.resolve(process.cwd(), "public", "content", "posts.generated.json");

// 2. Đảm bảo thư mục đầu ra tồn tại
const outputDir = path.dirname(jsonResultFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 3. Kiểm tra an toàn xem thư mục .md có ở đó không
if (!fs.existsSync(targetFolder)) {
  console.error(`❌ Thư mục bài viết không tồn tại ở: ${targetFolder}`);
  fs.writeFileSync(jsonResultFile, JSON.stringify([], null, 2));
  process.exit(1);
}

// 4. Quét và gom bài viết (Đổi tên biến thành 'allMarkdownFiles' để không bao giờ bị trùng)
const allMarkdownFiles = fs
  .readdirSync(targetFolder)
  .filter((fileName) => fileName.endsWith(".md"))
  .map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(targetFolder, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      content,
      ...data,
    };
  });

// 5. Ghi ra file JSON
fs.writeFileSync(jsonResultFile, JSON.stringify(allMarkdownFiles, null, 2));
console.log(`\n✅ THÀNH CÔNG RỰC RỠ: Đã gộp ${allMarkdownFiles.length} bài viết .md vào file posts.generated.json!`);