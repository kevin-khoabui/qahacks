import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const OUTPUT_FILE = path.join(process.cwd(), 'migration.sql');

function generateMigration() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  let sqlContent = "BEGIN TRANSACTION;\n";

  files.forEach(file => {
    const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, file), 'utf8'));
    
    // Escape dấu nháy đơn
    const slug = file.replace('.md', '');
    const title = String(data.title || '').replace(/'/g, "''");
    const contentSql = content.replace(/'/g, "''");
    const target_role = JSON.stringify(data.target_role || []);
    const category = JSON.stringify(data.category || []);

    sqlContent += `INSERT OR REPLACE INTO posts (slug, title, content, target_role, category, difficulty, tool_stack) VALUES ('${slug}', '${title}', '${contentSql}', '${target_role}', '${category}', '${data.difficulty || 'Intermediate'}', '${data.tool_stack || 'Generic'}');\n`;
  });

  sqlContent += "COMMIT;";
  fs.writeFileSync(OUTPUT_FILE, sqlContent);
  console.log(`✅ Đã tạo file ${OUTPUT_FILE} với ${files.length} câu lệnh INSERT.`);
}

generateMigration();