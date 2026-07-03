import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // BỔ SUNG: Chặn Googlebot quét các URL chứa tham số (query parameters)
      disallow: ["/*?*"], 
    },
    sitemap: "https://qahacks.com/sitemap.xml",
  };
}