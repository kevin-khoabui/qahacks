// ÉP NEXT.JS BIÊN DỊCH FILE SITEMAP THÀNH FILE TĨNH ĐỂ KHÔNG BỊ BẮT LỖI KHI BUILD
export const dynamic = "force-static";

import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts'; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts = getAllPosts();
  const baseUrl = 'https://qahacks.com';

  // 1. Tự động sinh danh sách URL cho từng bài viết chi tiết (Priority 0.8)
  const postEntries: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // ============================================================================
  // 🎯 2. KHAI BÁO CỨNG DANH MỤC NGÁCH TRÊN HEADER Navbar ĐỂ BOT GOOGLE CÀO SIÊU TỐC
  // ============================================================================
  const categoriesConfig = [
    { segment: 'types', values: ['Compilation', 'Situational'] },
    { segment: 'roles', values: ['Manual_QA_Engineer', 'Automation_QA_Engineer', 'QA_Lead'] },
    { segment: 'categories', values: ['Analytical_Behavioral', 'Technical'] },
    { segment: 'sub-categories', values: ['Strategy', 'Automation'] },
    { segment: 'testing-types', values: ['Manual', 'Automation'] },
    { segment: 'domains', values: ['Enterprise-Software', 'Banking_Finance'] },
    { segment: 'platforms', values: ['Cross-platform', 'Web'] },
    { segment: 'tools', values: ['Playwright', 'Cypress', 'None', 'Generic'] },
    { segment: 'difficulties', values: ['Intermediate', 'Advanced'] }
  ];

  const categoryEntries: MetadataRoute.Sitemap = [];

  categoriesConfig.forEach(({ segment, values }) => {
    values.forEach((val) => {
      categoryEntries.push({
        url: `${baseUrl}/${segment}/${val}`,
        lastModified: new Date(),
        changeFrequency: 'daily', // Đặt daily vì AI sẽ đẻ bài liên tục vào các ngách này
        priority: 0.9,            // Ưu tiên cao 0.9 vì đây là trang Hub chứa nhiều bài viết
      });
    });
  });

  // ============================================================================
  // 🚀 3. TỔNG HỢP VÀ XUẤT BẢN SITEMAP TOÀN DIỆN
  // ============================================================================
  return [
    // Trang chủ gánh Dashboard tổng
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // Các trang pháp lý phụ trợ cho Google AdSense duyệt uy tín website
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    
    // Đống link danh mục vạn năng chuẩn SEO URL
    ...categoryEntries,
    
    // Toàn bộ các bài viết chi tiết
    ...postEntries,
  ];
}