import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ category?: string; sub?: string; type?: string }>;
}

export default async function HomePage({ searchParams }: Props) {
  // Lấy toàn bộ danh sách bài viết gốc từ thư mục content/posts
  const allPosts = getAllPosts();
  
  // Đọc các tham số lọc từ URL thanh điều hướng (Navbar)
  const params = await searchParams;
  const filterCategory = params.category;
  const filterSub = params.sub;
  const filterType = params.type; 

  // TIẾN HÀNH PHÂN LUỒNG LỌC DỮ LIỆU THÔNG MINH
  const filteredPosts = allPosts.filter((post) => {
    // Ép kiểu qua 'any' hoặc sử dụng trực tiếp thuộc tính từ PostData đã cập nhật
    const qType = (post as any).question_type;

    // KỊCH BẢN 1: Nếu người dùng bấm vào danh mục "Compilations" (?type=Compilation)
    if (filterType === "Compilation") {
      return qType === "Compilation";
    }

    // KỊCH BẢN 2: Nếu người dùng bấm vào các mục kỹ thuật (Automation, API, Database...)
    // Hệ thống sẽ chỉ hiển thị các câu hỏi ĐƠN LẺ (giấu các bài Top bộ đề đi để không bị loãng)
    if (filterSub || filterCategory) {
      if (qType === "Compilation") return false; // Loại bỏ bài bộ đề
      if (filterCategory && post.category !== filterCategory) return false;
      if (filterSub && post.sub_category !== filterSub) return false;
      return true;
    }

    // MẶC ĐỊNH (Trang chủ sơ khởi): Hiển thị tất cả mọi thứ để trang web trông dày dặn
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Phần header động thay đổi theo bộ lọc */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-6 mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="inline-block w-2.5 h-6 bg-emerald-400 rounded-full"></span>
              {filterType === "Compilation" 
                ? "⭐ Mega Interview Compilations" 
                : (filterSub ? `${filterSub.replace(/_/g, " ")} Questions` : (filterCategory?.replace(/_/g, " ") || "All Interview Guides"))} ({filteredPosts.length})
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {filterType === "Compilation" 
                ? "Curated high-volume preparation guides containing Top 10, 20, 30 questions and answers." 
                : `Deep-dive technical questions and production-grade solutions for ${filterSub || "QA Professionals"}.`}
            </p>
          </div>

          {/* Nút xóa bộ lọc quay về trang chủ ban đầu */}
          {(filterCategory || filterSub || filterType) && (
            <Link href="/" className="text-xs text-emerald-400 hover:text-emerald-300 border border-slate-800 bg-slate-900/30 px-3 py-1.5 rounded-lg transition-colors">
              Clear Filter ✕
            </Link>
          )}
        </div>

        {/* LƯỚI HIỂN THỊ CÁC THẺ BÀI VIẾT */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-900 rounded-2xl bg-slate-900/10">
            <p className="text-slate-500 text-sm">No items found in this section yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => {
              const qType = (post as any).question_type;
              return (
                <Link 
                  key={post.slug} 
                  href={`/posts/${post.slug}`}
                  className="group block p-6 bg-slate-900/40 rounded-2xl border border-slate-900/60 hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all duration-200"
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      {/* Thẻ định dạng loại câu hỏi nhỏ nhắn phía trên */}
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider mb-3">
                        <span className={`px-2 py-0.5 rounded border ${
                          qType === "Compilation" 
                            ? "text-amber-400 bg-amber-950/40 border-amber-900/30" 
                            : "text-emerald-400 bg-emerald-950/40 border-emerald-900/30"
                        }`}>
                          {qType === "Compilation" ? "MEGA COMPILATION" : (post.sub_category || "General")}
                        </span>
                        <span className="bg-slate-900/50 text-slate-400 px-2 py-0.5 rounded border border-slate-800/30">
                          {post.difficulty}
                        </span>
                      </div>

                      {/* Tiêu đề bài viết */}
                      <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-3 leading-snug">
                        {post.title}
                      </h3>
                    </div>

                    <div className="mt-5 flex items-center text-xs font-semibold text-slate-500 group-hover:text-emerald-400 transition-colors pt-2 border-t border-slate-900/40">
                      {qType === "Compilation" ? "Open Full Compilation" : "Practice Solution"}
                      <svg className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}