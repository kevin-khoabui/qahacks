import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // 🚀 Ép Next.js xuất ra file tĩnh thuần túy (HTML/CSS/JS)
  
  images: {
    unoptimized: true, // Bắt buộc phải có để tránh lỗi tối ưu hóa ảnh tĩnh
  },

  // ============================================================================
  // HỆ THỐNG PHÒNG THỦ SEO: CHUYỂN HƯỚNG CÁC LINK .MD ĐỂ TRÁNH LỖI 404
  // ============================================================================
  async redirects() {
    return [
      {
        // Bẫy bất kỳ ai hoặc con bot nào truy cập thẳng vào link file .md thô cũ
        source: '/content/posts/:slug\\.md', 
        destination: '/posts/:slug', // Đá họ sang trang giao diện hiển thị bài viết chuẩn SEO
        permanent: true, // Trả về mã 301 Permanent Redirect (Giữ 100% sức mạnh SEO cho link)
      },
      {
        // Bẫy trường hợp họ mò vào thư mục cha công cộng
        source: '/content/posts',
        destination: '/', // Đá thẳng về trang chủ Hub
        permanent: true,
      }
    ];
  },
};

export default nextConfig;