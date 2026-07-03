import type { MetadataRoute } from "next";
import { getDB } from "@/lib/posts";

const baseUrl = "https://qahacks.com";

function safeDate(value: unknown): Date {
  if (!value || typeof value !== "string") return new Date();

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const categoriesConfig = [
    {
      segment: "roles",
      values: [
        "Manual_QA_Engineer",
        "Automation_QA_Engineer",
        "QA_Leader",
        "Software_Engineer",
      ],
    },
    {
      segment: "categories",
      values: [
        "Analytical_Behavioral",
        "Technical",
        "Strategic",
        "Leadership",
        "Foundations_Methodology",
      ],
    },
    {
      segment: "tools",
      values: ["Playwright", "Cypress", "Postman", "DevTools", "Generic"],
    },
  ];

  const categoryEntries: MetadataRoute.Sitemap = categoriesConfig.flatMap(
    ({ segment, values }) =>
      values.map((value) => ({
        url: `${baseUrl}/${segment}/${encodeURIComponent(value)}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      }))
  );

  try {
    const db = await getDB();

    const { results } = await db
      .prepare(
        `
        SELECT slug, date
        FROM posts
        WHERE slug IS NOT NULL
        ORDER BY date DESC
        LIMIT 5000
        `
      )
      .all();

    const postEntries: MetadataRoute.Sitemap = (results || []).map((post: any) => ({
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: safeDate(post.date),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticEntries, ...categoryEntries, ...postEntries];
  } catch (error) {
    console.warn("Sitemap fallback used:", error);
    return [...staticEntries, ...categoryEntries];
  }
}