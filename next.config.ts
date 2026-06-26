import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  typescript: {
    ignoreBuildErrors: true, 
  },
};

// Sử dụng dynamic import hoặc require an toàn hơn
if (process.env.NODE_ENV === 'development') {
  const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev');
  setupDevPlatform({
    d1Databases: ['DB'],
    // Nếu bạn muốn dùng remote database khi chạy dev local:
    remote: true
  });
}

export default nextConfig;