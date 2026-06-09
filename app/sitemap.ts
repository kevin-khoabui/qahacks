// ÉP NEXT.JS BIÊN DỊCH FILE SITEMAP THÀNH FILE TĨNH ĐỂ KHÔNG BỊ BẮT LỖI KHI BUILD
export const dynamic = "force-static";

import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts'; // Hàm quét tất cả bài viết hiện có của bạn

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts = getAllPosts();
  const baseUrl = 'https://qahacks.com';

  const postEntries = allPosts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...postEntries,
  ];
}