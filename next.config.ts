import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  /* Bắt buộc phải có khi dùng static export để tránh lỗi tối ưu hóa ảnh trên Edge */
  images: {
    unoptimized: true, 
  },
};

export default nextConfig;