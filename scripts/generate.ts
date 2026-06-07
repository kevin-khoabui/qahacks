import * as dotenv from "dotenv";
import * as path from "path";

// 1. Nạp cấu hình bảo mật .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ Lỗi: Chưa cấu hình GEMINI_API_KEY trong file .env.local");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);
// Sử dụng mô hình gemini-2.5-flash để vừa thông minh vừa tối ưu chi phí và tốc độ
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateInterviewQuestion(topic: string) {
  // BẢN PROMPT SIÊU CẤP: Ép AI làm cả nhiệm vụ phân tích cấu trúc Taxonomy Guideline của hệ thống
  const prompt = `
    You are an expert Software Testing Specialist, a Technical Interviewer, and an SEO expert.
    Generate an in-depth interview Q&A post (consisting of exactly one interview question and a highly detailed comprehensive answer) regarding this topic: "${topic}".
    
    CRITICAL REQUIREMENT 1 (AUTOMATIC TAXONOMY MAPPING):
    You must dynamically analyze the given topic and determine the correct metadata values based on our strict system architecture guidelines:
    - "category": Must be one of ['Technical', 'Foundations', 'Analytical_Behavioral'].
    - "sub_category": Must map logically (e.g., 'Automation', 'API', 'Database', 'Performance', 'Security', 'Manual', 'Methodology', 'Strategy', 'Behavioral').
    - "difficulty": Set 'Basic', 'Intermediate', or 'Advanced' based on the technical depth required.
    - "target_role": Determine the realistic industry role (e.g., 'Junior_QA_Engineer', 'QA_Engineer', 'Senior_Automation', 'QA_Lead', 'QA_Data_Analyst').
    - "tool_stack": Identify the main tool used (e.g., 'Playwright', 'Cypress', 'JMeter', 'Postman', 'SQL', or 'None' if it is a manual/behavioral topic).

    CRITICAL REQUIREMENT 2 (OUTPUT FORMAT):
    The entire output MUST be in raw Markdown format and MUST start with the exact Frontmatter structure below. Do not wrap the frontmatter or the whole response in code blocks like \`\`\`markdown. Output only the raw text starting with the dashes.

    ---
    title: 'A concise, catchy, and SEO-optimized title tailored for the post'
    difficulty: '[Insert Dynamic Value]'
    target_role: '[Insert Dynamic Value]'
    category: '[Insert Dynamic Value]'
    sub_category: '[Insert Dynamic Value]'
    question_type: 'Code-challenge' (or 'Conceptual', 'Scenario-based', 'Behavioral' depending on the content)
    core_testing_type: 'Functional' (or 'Non-Functional')
    domain: 'E-commerce'
    platform: 'Web'
    tool_stack: '[Insert Dynamic Value]'
    tags: ['testing', 'interview-prep', 'automatically-generated-tag']
    ---
    
    ### Interview Question:
    [Provide the clear, professional interview question tailored for the dynamically chosen target_role and difficulty]
    
    ### Expert Answer:
    [Provide a thorough technical answer explaining the core concept, the "why" behind the solution, and handle edge cases. If code or queries are relevant for the tool_stack, write clean, production-ready, and well-commented code inside standard markdown code blocks]
  `;

  try {
    console.log(`🤖 Đang yêu cầu Gemini tự động phân tích và sinh bài viết cho chủ đề: "${topic}"...`);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Làm sạch dữ liệu trả về phòng trường hợp AI tự ý bọc thẻ markdown thô ngoài rìa
    const cleanMarkdown = responseText.replace(/^```markdown\n/, "").replace(/\n```$/, "");
    
    // Tạo tên file chuẩn hóa (Slug) từ chủ đề đầu vào
    const fileName = `${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
    
    const outputDir = path.join(process.cwd(), "content", "posts");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, fileName);
    fs.writeFileSync(outputPath, cleanMarkdown, "utf-8");
    console.log(`✅ Tự động phân loại và xuất file thành công: /content/posts/${fileName}`);
  } catch (error) {
    console.error(`❌ Gặp lỗi xử lý API tại chủ đề [${topic}]:`, error);
  }
}

// 3. TIẾN TRÌNH ĐIỀU PHỐI ĐỌC FILE TỰ ĐỘNG
async function main() {
  const argumentTopic = process.argv[2];

  if (argumentTopic) {
    // Chạy bài lẻ
    await generateInterviewQuestion(argumentTopic);
  } else {
    // Chạy hàng loạt từ file topics.txt
    const filePath = path.join(process.cwd(), "topics.txt");

    if (!fs.existsSync(filePath)) {
      console.error("❌ Lỗi: Không tìm thấy file topics.txt ở thư mục gốc!");
      process.exit(1);
    }

    const bulkTopics = fs
      .readFileSync(filePath, "utf-8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (bulkTopics.length === 0) {
      console.log("ℹ️ File topics.txt đang trống.");
      return;
    }

    console.log(`🚀 Khởi động hệ thống thông minh. Phát hiện ${bulkTopics.length} chủ đề cần xử lý...`);

    for (let i = 0; i < bulkTopics.length; i++) {
      const topic = bulkTopics[i];
      const fileName = `${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
      const outputPath = path.join(process.cwd(), "content", "posts", fileName);

      // Chống trùng file để tiết kiệm tài nguyên
      if (fs.existsSync(outputPath)) {
        console.log(`⏩ [${i + 1}/${bulkTopics.length}] Đã có sẵn, bỏ qua: ${fileName}`);
        continue;
      }

      await generateInterviewQuestion(topic);

      // Nghỉ giải lao bọc chốt chặn an toàn 6 giây chống lỗi Rate Limit 429
      if (i < bulkTopics.length - 1) {
        console.log(`⏱️ Đang nghỉ 6 giây trước khi chuyển sang bài tiếp theo...`);
        await delay(6000);
      }
    }
    console.log("🎉 TỰ ĐỘNG CẬP NHẬT TOÀN BỘ KHO DỮ LIỆU HOÀN TẤT VÀ CHUẨN XÁC VỚI TAXONOMY!");
  }
}

main();