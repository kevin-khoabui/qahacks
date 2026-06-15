import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryPaginationClient from "./CategoryPaginationClient";

interface Props {
  params: Promise<{ slug: string[] }>;
}

// ÉP NEXT.JS BIÊN DỊCH FILE ROUTER THÀNH FILE TĨNH ĐỂ KHÔNG BỊ BẮT LỖI KHI BUILD
export const dynamic = "force-static";

// ============================================================================
// 🛠️ HÀM PHỤ TRỢ: CHUẨN HÓA DỮ LIỆU ĐA THẺ TUYỆT ĐỐI (ROBUST ARRAY CLEANER)
// ============================================================================
function cleanAndExtractArray(fieldData: any): string[] {
  if (!fieldData) return [];
  if (Array.isArray(fieldData)) {
    return fieldData.map(item =>
      String(item).toLowerCase().replace(/[^a-z0-9]/g, "")
    );
  }
  const rawString = String(fieldData).toLowerCase();
  const sanitized = rawString.replace(/[\[\]"'\\]/g, "");
  return sanitized.split(",").map(item => item.trim().replace(/[^a-z0-9]/g, "")).filter(Boolean);
}

function cleanSingleString(fieldData: any): string {
  if (!fieldData) return "";
  return String(fieldData).toLowerCase().replace(/[\[\]"'\\]/g, "").replace(/[^a-z0-9]/g, "");
}

// ============================================================================
// 🎯 1. BỘ GENERATE TĨNH CHỐNG SẬP BUILD (ĐÃ FIX KHỚP REN DẤU GẠCH DƯỚI)
// ============================================================================
export async function generateStaticParams() {
  const allPosts = getAllPosts();
  const paths: { slug: string[] }[] = [];

  const roles = new Set<string>();
  const categories = new Set<string>();
  const subCategories = new Set<string>();
  const testingTypes = new Set<string>();
  const domains = new Set<string>();
  const platforms = new Set<string>();
  const tools = new Set<string>();
  const difficulties = new Set<string>();
  const types = new Set<string>();

  allPosts.forEach((post) => {
    const rawRoles: string[] = Array.isArray((post as any).target_role)
      ? (post as any).target_role
      : [String((post as any).target_role || "")];

    const rawCats: string[] = Array.isArray(post.category)
      ? post.category
      : [String(post.category || "")];

    rawRoles.forEach(r => r && roles.add(r.replace(/[\[\]"'\\]/g, "").trim().replace(/\s+/g, "_")));
    rawCats.forEach(c => c && categories.add(c.replace(/[\[\]"'\\]/g, "").trim().replace(/\s+/g, "_")));

    if ((post as any).sub_category) subCategories.add(cleanSingleString((post as any).sub_category));
    if ((post as any).core_testing_type) testingTypes.add(cleanSingleString((post as any).core_testing_type));
    if ((post as any).domain) domains.add(cleanSingleString((post as any).domain));
    if ((post as any).platform) platforms.add(cleanSingleString((post as any).platform));
    if ((post as any).tool_stack) tools.add(cleanSingleString((post as any).tool_stack));
    if ((post as any).difficulty) difficulties.add(cleanSingleString((post as any).difficulty));
    if ((post as any).question_type) types.add(cleanSingleString((post as any).question_type));
  });

  // Hàng rào bảo vệ hệ thống Menu không dính lỗi 500 khi kho bài trống
  types.add("Compilation");
  types.add("Situational");
  roles.add("Manual_QA_Engineer");
  roles.add("Automation_QA_Engineer");
  roles.add("QA_Lead");
  categories.add("Analytical_Behavioral");
  categories.add("Technical");
  subCategories.add("Strategy");
  subCategories.add("Automation");
  testingTypes.add("Manual");
  testingTypes.add("Automation");
  domains.add("Enterprise-Software");
  domains.add("Banking_Finance");
  platforms.add("Cross-platform");
  platforms.add("Web");
  tools.add("Playwright");
  tools.add("Cypress");
  tools.add("Generic");
  tools.add("None");
  difficulties.add("Intermediate");
  difficulties.add("Advanced");

  // Đóng gói mảng URL tĩnh
  roles.forEach(r => paths.push({ slug: ["roles", r] }));
  categories.forEach(c => paths.push({ slug: ["categories", c] }));
  subCategories.forEach(sc => paths.push({ slug: ["sub-categories", sc] }));
  testingTypes.forEach(tt => paths.push({ slug: ["testing-types", tt] }));
  domains.forEach(d => paths.push({ slug: ["domains", d] }));
  platforms.forEach(p => paths.push({ slug: ["platforms", p] }));
  tools.forEach(t => paths.push({ slug: ["tools", t] }));
  difficulties.forEach(df => paths.push({ slug: ["difficulties", df] }));
  paths.push({ slug: ["types", "compilation"] });
  paths.push({ slug: ["types", "situational"] });

  return paths;
}

// ============================================================================
// 🔍 2. DYNAMIC METADATA CHO TỪNG TRANG DANH MỤC (BỌC GIÁP CANONICAL LINK)
// ============================================================================
export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const [segment, value] = resolvedParams.slug || [];
  if (!segment || !value) return {};

  const cleanValue = value.replace(/_/g, " ");
  const currentUrl = `https://qahacks.com/${segment}/${value}`;
  const pageTitle = `${cleanValue} Interview Questions & Strategic Blueprints | QAHacks`;
  const pageDesc = `Deep-dive production-grade software testing question banks and vetted interview answers filtered by ${segment}: ${cleanValue}.`;

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: currentUrl, // 🚀 KHÓA LINK CHÍNH CHỦ: Chống bẫy trùng lặp content của Google Bot
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: currentUrl,
      siteName: "QAHacks",
      type: "website",
      images: [
        {
          url: "https://qahacks.com/og-image.png", // Bạn có thể thêm file ảnh og mặc định trong thư mục public
          width: 1200,
          height: 630,
          alt: "QAHacks Knowledge Hub Dashboard",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDesc,
    },
  };
}

// ============================================================================
// 🚀 3. BỘ LỌC VẠN NĂNG SIÊU CẤP (ANTI-404 ENGINE)
// ============================================================================
export default async function DynamicCategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const [segment, value] = resolvedParams.slug || [];

  if (!segment || !value) {
    notFound();
  }

  const allPosts = getAllPosts();
  const cleanUrlValue = value.toLowerCase().replace(/[^a-z0-9]/g, "");

  const filteredPosts = allPosts.filter((post) => {
    const postRoles = cleanAndExtractArray((post as any).target_role);
    const postCategories = cleanAndExtractArray(post.category);
    const postSubCategory = cleanSingleString((post as any).sub_category);
    const postTestingType = cleanSingleString((post as any).core_testing_type);
    const postDomain = cleanSingleString((post as any).domain);
    const postPlatform = cleanSingleString((post as any).platform);
    const postTool = cleanSingleString((post as any).tool_stack);
    const postDifficulty = cleanSingleString((post as any).difficulty);
    const postQuestionType = cleanSingleString((post as any).question_type);

    switch (segment) {
      case "roles":
        return postRoles.includes(cleanUrlValue);
      case "categories":
        return postCategories.includes(cleanUrlValue);
      case "sub-categories":
        return postSubCategory === cleanUrlValue;
      case "testing-types":
        return postTestingType === cleanUrlValue;
      case "domains":
        return postDomain === cleanUrlValue;
      case "platforms":
        return postPlatform === cleanUrlValue;
      case "tools":
        if ((cleanUrlValue === "generic" || cleanUrlValue === "none") && (postTool === "none" || postTool === "generic" || postTool === "")) {
          return true;
        }
        return postTool === cleanUrlValue;
      case "difficulties":
        return postDifficulty === cleanUrlValue;
      case "types":
        return postQuestionType === cleanUrlValue;
      default:
        return false;
    }
  });

  const displayTitle = value.replace(/_/g, " ");
  const displaySegment = segment.replace(/-/g, " ");

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <section className="max-w-6xl mx-auto">

        {/* Tiêu đề danh mục phục vụ Bot SEO */}
        <div id="category-hub-top" className="border-b border-slate-900 pb-6 mb-8 scroll-mt-20">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            {displaySegment}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            {displayTitle} <span className="text-slate-500 font-normal">({filteredPosts.length} items)</span>
          </h1>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-4 border border-dashed border-slate-900 rounded-2xl bg-slate-900/10 max-w-2xl mx-auto mt-10">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-full text-slate-500 mb-5 animate-pulse">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-200 tracking-tight">
              Handbook Catalog Updating
            </h3>
            <p className="text-xs text-slate-400 mt-2 max-w-md leading-relaxed">
              Our automated QA knowledge engine is currently generating production-grade solutions and speaking blueprints for this specific segment. Please check back shortly!
            </p>
            <Link
              href="/"
              className="mt-8 px-4 py-2 text-xs font-bold text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-xl transition-all duration-200 cursor-pointer"
            >
              ← Return to Dashboard
            </Link>
          </div>
        ) : (
          /* ĐẨY SANG COMPONENT CLIENT ĐỂ XỬ LÝ PHÂN TRANG 24 BÀI */
          <CategoryPaginationClient posts={filteredPosts} />
        )}
      </section>
    </main>
  );
}