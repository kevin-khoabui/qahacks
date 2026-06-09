import fs from "fs";
import path from "path";
import matter from "gray-matter";

// 1. CHỈ ĐÚNG VỊ TRÍ MỚI: Thư mục content đã được đưa ra ngoài gốc (an toàn, không lo bị lộ)
const targetFolder = path.resolve(process.cwd(), "content", "posts");

// 2. GIỮ NGUYÊN FILE ĐẦU RA Ở TRONG PUBLIC: Để Next.js và Cloudflare đọc được lúc runtime
const jsonResultFile = path.resolve(process.cwd(), "public", "content", "posts.generated.json");

// Đảm bảo thư mục public/content/ luôn tồn tại để chứa file JSON
const outputDir = path.dirname(jsonResultFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Kiểm tra an toàn xem thư mục .md ngoài gốc có ở đó không
if (!fs.existsSync(targetFolder)) {
  console.error(`❌ Thư mục bài viết không tồn tại ở: ${targetFolder}`);
  fs.writeFileSync(jsonResultFile, JSON.stringify([], null, 2));
  process.exit(1);
}

// Quét và gom 108 bài viết từ thư mục gốc ẩn mật
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

// Ghi đè dữ liệu sạch vào file JSON công cộng
fs.writeFileSync(jsonResultFile, JSON.stringify(allMarkdownFiles, null, 2));
console.log(`\n✅ THÀNH CÔNG RỰC RỠ: Đã gộp ${allMarkdownFiles.length} bài viết .md an toàn vào file posts.generated.json!`);