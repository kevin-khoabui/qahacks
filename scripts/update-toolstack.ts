import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 🌐 GIẢ LẬP __DIRNAME CHO MÔI TRƯỜNG ES MODULE
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📂 ĐƯỜNG DẪN TỚI THƯ MỤC CHỨA FILE .MD CỦA BẠN
const POSTS_DIR = path.join(__dirname, '../content/posts'); 
const BACKUP_DIR = path.join(__dirname, '../content/posts_backup_safe'); 

// 🎯 BẢN ĐỒ TỪ KHÓA NHẬN DIỆN TOOL STACK
const TOOL_KEYWORDS: { [key: string]: string[] } = {
  'Cypress': ['cypress', 'cy.', 'cy.visit', 'cy.get'],
  'Playwright': ['playwright', 'page.goto', 'await page.'],
  'Selenium': ['selenium', 'webdriver', 'chromedriver', 'driver.find'],
  'Postman': ['postman', 'newman', 'pm.test', 'pm.expect'],
  'Jira': ['jira', 'zephyr', 'xray'],
  'TestRail': ['testrail'],
  'JMeter': ['jmeter', '.jmx', 'thread group']
};

// 🛡️ HÀM TỰ ĐỘNG SAO LƯU PHÒNG HỜ SỰ CỐ
function backupFolder(src: string, dest: string) {
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(dest, { recursive: true });
  const files = fs.readdirSync(src);
  files.forEach(file => {
    fs.copyFileSync(path.join(src, file), path.join(dest, file));
  });
  console.log(`🛡️  [AN TOÀN] Đã tạo bản sao lưu dữ liệu tại: ${dest}`);
}

function detectToolStack(content: string): string {
  const lowerContent = content.toLowerCase();
  for (const [tool, keywords] of Object.entries(TOOL_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerContent.includes(keyword.toLowerCase())) {
        return tool;
      }
    }
  }
  return 'Generic';
}

function migrateToolStack() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`❌ Không tìm thấy thư mục bài viết tại: ${POSTS_DIR}`);
    return;
  }

  // 1. Sao lưu an toàn trước khi chạy
  backupFolder(POSTS_DIR, BACKUP_DIR);

  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
  console.log(`🔍 Tìm thấy tổng cộng ${files.length} file .md. Tiến hành quét dữ liệu...`);

  let updatedCount = 0;
  let skippedCount = 0;

  try {
    files.forEach(file => {
      const filePath = path.join(POSTS_DIR, file);
      let fileContent = fs.readFileSync(filePath, 'utf8');

      const hasNoneToolStack = /tool_stack:\s*["']None["']/g.test(fileContent);

      if (hasNoneToolStack) {
        const exactTool = detectToolStack(fileContent);
        fileContent = fileContent.replace(/tool_stack:\s*["']None["']/g, `tool_stack: "${exactTool}"`);
        
        fs.writeFileSync(filePath, fileContent, 'utf8');
        console.log(`✅ Đã cập nhật [${file}] ➡️ tool_stack: "${exactTool}"`);
        updatedCount++;
      } else {
        skippedCount++;
      }
    });

    console.log(`\n==================================================`);
    console.log(`📊 BÁO CÁO HOÀN THÀNH MIGRATION:`);
    console.log(`- Đã sửa lỗi thành công: ${updatedCount} file.`);
    console.log(`- Bỏ qua (đã có sẵn hoặc không bị lỗi None): ${skippedCount} file.`);
    console.log(`💡 Mẹo: Dữ liệu gốc an toàn đã được backup ở thư mục 'posts_backup_safe'.`);
    console.log(`==================================================`);

  } catch (error) {
    console.error(`\n❌ SỰ CỐ XẢY RA KHI ĐANG CHẠY:`, error);
    console.log(`🚨 HƯỚNG DẪN ROLLBACK HỦY BỎ THAO TÁC:`);
    console.log(`Hãy xóa thư mục 'posts' và đổi tên thư mục 'posts_backup_safe' thành 'posts' để khôi phục.`);
  }
}

migrateToolStack();