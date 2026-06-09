// ÉP NEXT.JS BIÊN DỊCH FILE SITEMAP THÀNH FILE TĨNH ĐỂ KHÔNG BỊ BẮT LỖI KHI BUILD
export const dynamic = "force-static";

import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts'; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts = getAllPosts();
  const baseUrl = 'https://qahacks.com';

  // Quét 108 bài viết từ JSON đã nén để tạo danh sách link động
  const postEntries: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Gộp trang chủ (priority 1.0) và đống bài viết lại
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