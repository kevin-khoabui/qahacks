import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

// Hàm lấy dữ liệu chi tiết của một bài viết dựa vào tên file (slug)
export async function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Dùng gray-matter để tách phần Metadata (Frontmatter) và phần Nội dung (Content)
  const { data, content } = matter(fileContents);

  return {
    slug,
    content,
    ...(data as {
      title: string;
      difficulty: string;
      target_role: string;
      category: string;
      sub_category: string;
      question_type: string;
      tool_stack: string;
      tags: string[];
    }),
  };
}

// Hàm lấy danh sách tất cả bài viết để hiển thị ngoài trang chủ
export function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) return [];
  
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        ...(data as {
          title: string;
          difficulty: string;
          category: string;
          sub_category: string;
          tool_stack: string;
        }),
      };
    });

  return allPostsData;
}