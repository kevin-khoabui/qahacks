// 1. Import file JSON bình thường
import generatedPosts from "@/public/content/posts.generated.json";

// Định nghĩa cấu trúc dữ liệu chuẩn (Interface)
export interface PostData {
  slug: string;
  title: string;
  difficulty: string;
  target_role: string;
  category: string;
  sub_category: string;
  question_type: string; 
  tool_stack: string;
  tags: string[];
  content: string;
  date?: string;
}

// 2. ÉP KIỂU dữ liệu để TypeScript hiểu file JSON này chứa danh sách các bài viết PostData
const posts = generatedPosts as PostData[];

// ========================================================
// 1. HÀM LẤY CHI TIẾT BÀI VIẾT (Bây giờ p.slug sẽ hết sạch lỗi)
// ========================================================
export async function getPostData(slug: string): Promise<PostData | null> {
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;
  return post;
}

// ========================================================
// 2. HÀM LẤY TẤT CẢ BÀI VIẾT
// ========================================================
export function getAllPosts() {
  return posts.map(({ content, ...post }) => ({
    slug: post.slug,
    ...(post as Omit<PostData, "slug" | "content">)
  }));
}

// ========================================================
// 3. HÀM LẤY BÀI VIẾT LIÊN QUAN
// ========================================================
export async function getRelatedPosts(currentSlug: string, currentCategory: string, limit: number = 2) {
  const related = posts.filter(
    (post) => post.category === currentCategory && post.slug !== currentSlug
  );

  return related.slice(0, limit).map(({ content, ...post }) => ({
    slug: post.slug,
    title: post.title,
    category: post.category,
    difficulty: post.difficulty,
    tool_stack: post.tool_stack,
  }));
}