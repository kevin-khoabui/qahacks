import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '../content/posts'); 

// ⚡ 1. BỘ TỪ KHÓA CHỈ DÀNH CHO CÁC BÀI AUTOMATION
const AUTOMATION_TOOLS: { [key: string]: string[] } = {
  'Cypress': ['cypress', 'cy.', 'cy.visit', 'cy.get'],
  'Playwright': ['playwright', 'page.goto', 'await page.'],
  'Selenium': ['selenium', 'webdriver', 'chromedriver', 'driver.find'],
  'JMeter': ['jmeter', '.jmx', 'thread group']
};

// 📋 2. BỘ TỪ KHÓA CHỈ DÀNH CHO CÁC BÀI MANUAL STRATEGY
const MANUAL_TOOLS: { [key: string]: string[] } = {
  'Postman': ['postman', 'newman', 'pm.test', 'pm.expect'],
  'Jira': ['jira', 'zephyr', 'xray'],
  'TestRail': ['testrail']
};

function detectToolStack(content: string, isAutomation: boolean): string {
  const lowerContent = content.toLowerCase();
  
  // Áp bộ lọc tương ứng với thể loại bài viết
  const keywordsMap = isAutomation ? AUTOMATION_TOOLS : MANUAL_TOOLS;

  for (const [tool, keywords] of Object.entries(keywordsMap)) {
    for (const keyword of keywords) {
      if (lowerContent.includes(keyword.toLowerCase())) {
        return tool;
      }
    }
  }
  return 'Generic'; // Trả về mặc định nếu không tìm thấy công cụ đặc trưng phù hợp
}

function migrateToolStackSecurely() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`❌ Không tìm thấy thư mục: ${POSTS_DIR}`);
    return;
  }

  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
  console.log(`🔍 Quét ${files.length} file .md với bộ lọc phân tách Automation/Manual...`);

  let updatedCount = 0;

  files.forEach(file => {
    const filePath = path.join(POSTS_DIR, file);
    let fileContent = fs.readFileSync(filePath, 'utf8');

    // Kiểm tra xem bài viết này thuộc thể loại nào bằng cách đọc Frontmatter
    const isAutomationPost = fileContent.includes('core_testing_type: "Automation"') || 
                             fileContent.includes('sub_category: "Automation"');

    // Chấp nhận quét lại cả những bài đang hiển thị sai tool_stack
    // Tìm và thay thế bất kể giá trị tool_stack cũ là gì để sửa lỗi nhiễm chéo
    const toolStackRegex = /tool_stack:\s*["'][^"']+["']/g;

    if (toolStackRegex.test(fileContent)) {
      const exactTool = detectToolStack(fileContent, isAutomationPost);
      
      // Tiến hành cập nhật/ghi đè lại giá trị chuẩn xác
      fileContent = fileContent.replace(toolStackRegex, `tool_stack: "${exactTool}"`);
      fs.writeFileSync(filePath, fileContent, 'utf8');
      updatedCount++;
    }
  });

  console.log(`\n==================================================`);
  console.log(`📊 ĐÃ CHUẨN HÓA THÀNH CÔNG:`);
  console.log(`- Đã ép lọc và sửa lỗi nhiễm chéo cho: ${updatedCount} file.`);
  console.log(`- Các bài Manual đã được bóc tách hoàn toàn khỏi Cypress/Playwright/Selenium.`);
  console.log(`==================================================`);
}

migrateToolStackSecurely();