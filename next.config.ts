import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  
  // THÊM ĐOẠN NÀY ĐỂ ĐIỆN THOẠI TRUY CẬP ĐƯỢC
  // Lưu ý: allowedDevOrigins chỉ có tác dụng khi chạy 'npm run dev'
  // Khi bạn đã chạy 'npm run build' để xuất ra 'out', nó không còn quan trọng nữa.
  typescript: {
    ignoreBuildErrors: true, // Tiện lợi khi đang trong giai đoạn dev nhanh
  },
};

export default nextConfig;