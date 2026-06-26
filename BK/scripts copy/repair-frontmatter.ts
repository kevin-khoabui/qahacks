import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

function repair() {
  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
  
  files.forEach(file => {
    const filePath = path.join(POSTS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    // Nếu thiếu các trường quan trọng, thêm vào
    if (!data.title || !data.target_role || !data.category || !data.difficulty) {
      console.log(`🛠️ Đang sửa file: ${file}`);
      
      data.title = data.title || file.replace(/-/g, ' ').replace('.md', '');
      data.target_role = data.target_role || ['QA_Engineer'];
      data.category = data.category || ['Technical'];
      data.difficulty = data.difficulty || 'Intermediate';

      const newContent = matter.stringify(content, data);
      fs.writeFileSync(filePath, newContent, 'utf8');
    }
  });
  console.log("✅ Đã sửa xong toàn bộ file bị thiếu dữ liệu!");
}

repair();