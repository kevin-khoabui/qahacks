import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts'; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts = await getAllPosts(); // Giờ đây đã là async
  const baseUrl = 'https://qahacks.com';

  // 1. URL các bài viết chi tiết
  const postEntries: MetadataRoute.Sitemap = allPosts.map((post: any) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 2. Danh mục ngách (Categories/Roles/Tools...)
  const categoriesConfig = [
    { segment: 'roles', values: ['Manual_QA_Engineer', 'Automation_QA_Engineer', 'QA_Lead'] },
    { segment: 'categories', values: ['Analytical_Behavioral', 'Technical'] },
    { segment: 'tools', values: ['Playwright', 'Cypress', 'None', 'Generic'] },
    { segment: 'difficulties', values: ['Intermediate', 'Advanced'] }
  ];

  const categoryEntries: MetadataRoute.Sitemap = [];
  categoriesConfig.forEach(({ segment, values }) => {
    values.forEach((val) => {
      categoryEntries.push({
        url: `${baseUrl}/${segment}/${val}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      });
    });
  });

  // 3. Tổng hợp và xuất bản
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    ...categoryEntries,
    ...postEntries,
  ];
}