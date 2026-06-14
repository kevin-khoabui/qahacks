import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Khóa chặt chế độ xuất trang tĩnh
  images: {
    unoptimized: true, // Bắt buộc phải có để Next.js không cố tối ưu ảnh động
  },
};

export default nextConfig;