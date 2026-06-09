export const dynamic = "force-static";

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/private/',
        '/content/', // CẤM BOT quét vào thư mục chứa JSON và các tài nguyên thô
      ],
    },
    sitemap: 'https://qahacks.com/sitemap.xml',
  };
}