import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",      // Ép xuất trang tĩnh ra thư mục out
  images: {
    unoptimized: true,   // Tắt tối ưu ảnh động để chạy được trên CDN tĩnh
  },
  trailingSlash: false,  // BẮT BUỘC: Ép file index.html phải nằm ở ngoài rìa thư mục out!
};

export default nextConfig;