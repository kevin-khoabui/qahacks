import * as dotenv from "dotenv";
import * as path from "path";

// Tự động tìm và nạp tệp cấu hình bảo mật .env.local của Next.js
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";


// 1. Khởi tạo cấu hình bộ não Gemini (Sử dụng bản Gemini 2.5 Flash / 2.0 Flash có tốc độ nhanh và rẻ)
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ Lỗi: Chưa cấu hình GEMINI_API_KEY trong file .env.local");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// 2. Định nghĩa hàm ra lệnh cho AI viết bài
async function generateInterviewQuestion(topic: string) {
    const prompt = `
    You are an expert Software Testing Engineer and an SEO optimization specialist.
    Generate an in-depth interview Q&A post (consisting of exactly one interview question and a highly detailed comprehensive answer) regarding the following technical topic: "${topic}".
    
    CRITICAL REQUIREMENT: The entire output MUST be in raw Markdown format and MUST start with the exact Frontmatter structure below. Do not wrap the frontmatter or the whole response in code blocks like \`\`\`markdown. Output only the raw text starting with the dashes.

    ---
    title: 'A concise, catchy, and SEO-optimized title for the post'
    difficulty: 'Advanced'
    target_role: 'Senior_Automation'
    category: 'Technical'
    sub_category: 'Automation'
    question_type: 'Code-challenge'
    core_testing_type: 'Functional'
    domain: 'E-commerce'
    platform: 'Web'
    tool_stack: 'Playwright'
    tags: ['playwright', 'testing', 'automation']
    ---
    
    ### Interview Question:
    [Provide the clear, professional interview question here]
    
    ### Expert Answer:
    [Provide a thorough, comprehensive technical answer. Explain the core concept, the "why" behind the solution, and handle edge cases. If code snippets are required, write clean, production-ready, and well-commented code inside standard markdown code blocks (\`\`\`js/\`\`\`ts...)]
  `;

    try {
        console.log(`🤖 Đang yêu cầu Gemini sinh bài viết cho chủ đề: ${topic}...`);
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Làm sạch chuỗi trả về nếu AI tự ý bọc thẻ ```markdown
        const cleanMarkdown = responseText.replace(/^```markdown\n/, "").replace(/\n```$/, "");

        // Tạo tên file chuẩn từ tiêu đề (slug)
        const fileName = `${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
        const outputPath = path.join(process.cwd(), "content", "posts", fileName);

        // Lưu file trực tiếp vào thư mục content/posts
        fs.writeFileSync(outputPath, cleanMarkdown, "utf-8");
        console.log(`✅ Đã tạo file thành công: /content/posts/${fileName}`);
    } catch (error) {
        console.error("❌ Gặp lỗi khi gọi API Gemini:", error);
    }
}

// 3. Chạy thử nghiệm kích hoạt tự động tạo 1 bài viết mẫu
// Sau này bạn có thể đổi chữ "Playwright Dynamic Dropdown" thành bất kỳ chủ đề QA nào bạn muốn
generateInterviewQuestion("Playwright Dynamic Dropdown");