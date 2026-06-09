import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ÉP NEXT.JS BIÊN DỊCH RA THƯ MỤC TĨNH 'OUT' */
  output: 'export', 
  
  /* Bắt buộc phải có khi dùng static export để tránh lỗi tối ưu hóa ảnh trên Edge */
  images: {
    unoptimized: true, 
  },
};

export default nextConfig;