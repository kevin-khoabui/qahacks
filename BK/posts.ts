// 1. Import file JSON bình thường
import generatedPosts from "@/public/content/posts.generated.json";

// ============================================================================
// 🎯 ĐỊNH NGHĨA CẤU TRÚC DỮ LIỆU ĐA THẺ CHUẨN (INTERFACE)
// ============================================================================
export interface PostData {
  slug: string;
  title: string;
  difficulty: string;
  target_role: string[]; // ✅ Đổi thành mảng chuỗi
  category: string[];    // ✅ Đổi thành mảng chuỗi
  sub_category: string;
  question_type: string; 
  tool_stack: string;
  tags: string[];
  content: string;
  date?: string;
}

// 2. ÉP KIỂU dữ liệu để TypeScript hiểu file JSON này chứa danh sách các bài viết PostData mảng
const rawPosts = generatedPosts as any[];

// Chuẩn hóa dữ liệu an toàn để tuyệt đối không crash kể cả khi file JSON chứa chuỗi đơn cũ
const posts: PostData[] = rawPosts.map((post) => ({
  ...post,
  title: post.title || "Untitled",
  content: post.content || "",
  difficulty: post.difficulty || "Advanced",
  target_role: Array.isArray(post.target_role) 
    ? post.target_role 
    : [post.target_role || "Manual_QA_Engineer"],
  category: Array.isArray(post.category) 
    ? post.category 
    : [post.category || "Leadership"],
  sub_category: post.sub_category || "Strategy",
  question_type: post.question_type || "Situational",
  tool_stack: post.tool_stack || "None",
  tags: post.tags || [],
}));

// ========================================================
// 1. HÀM LẤY CHI TIẾT BÀI VIẾT (Bây giờ p.slug sẽ hết sạch lỗi)
// ========================================================
export async function getPostData(slug: string): Promise<PostData | null> {
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;
  return post;
}

// ========================================================
// 2. HÀM LẤY TẤT CẢ BÀI VIẾT (Loại bỏ content để tối ưu RAM khi quét danh sách)
// ========================================================
export function getAllPosts() {
  return posts.map(({ content, ...post }) => ({
    ...post
  }));
}

// ========================================================
// 3. HÀM LẤY BÀI VIẾT LIÊN QUAN (Hỗ trợ quét theo mảng Category mới)
// ========================================================
export async function getRelatedPosts(currentSlug: string, currentCategory: string, limit: number = 3) {
  const related = posts.filter((post) => {
    // Nếu slug trùng bài hiện tại -> Bỏ qua
    if (post.slug === currentSlug) return false;

    // Kiểm tra xem mảng category của bài viết có chứa danh mục hiện tại không
    return post.category.includes(currentCategory);
  });

  return related.slice(0, limit).map(({ content, ...post }) => ({
    slug: post.slug,
    title: post.title,
    category: post.category,
    difficulty: post.difficulty,
    tool_stack: post.tool_stack,
  }));
}