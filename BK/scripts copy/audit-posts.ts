import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const REQUIRED_FIELDS = ['title', 'target_role', 'category', 'difficulty'];

function auditAndClean() {
  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
  console.log(`🔍 Bắt đầu Audit ${files.length} file...`);

  files.forEach(file => {
    const filePath = path.join(POSTS_DIR, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    let { data, content } = matter(fileContents);
    let isDirty = false;

    // 1. Kiểm tra thiếu trường bắt buộc
    REQUIRED_FIELDS.forEach(field => {
      if (!data[field]) {
        console.warn(`⚠️ [MISSING FIELD] ${file}: Thiếu ${field}`);
      }
    });

    // 2. Tự động xóa tiêu đề H1 trùng lặp trong nội dung
    // (Logic: Nếu dòng đầu tiên là # Title, xóa nó đi)
    if (content.trim().startsWith('# ')) {
      content = content.replace(/^#\s+.*$/m, '').trim();
      isDirty = true;
      console.log(`✅ [CLEANED] Đã xóa H1 rác trong: ${file}`);
    }

    // 3. Chuẩn hóa title (nếu cần)
    if (data.title && typeof data.title !== 'string') {
        data.title = String(data.title);
        isDirty = true;
    }

    // Nếu có thay đổi, ghi lại file
    if (isDirty) {
      const newFileContent = matter.stringify(content, data);
      fs.writeFileSync(filePath, newFileContent, 'utf8');
    }
  });

  console.log(`\n🎉 Đã hoàn tất Audit và làm sạch.`);
}

auditAndClean();