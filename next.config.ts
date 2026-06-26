import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Bắt buộc cho local dev khi dùng getCloudflareContext()
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;