import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Nạp cấu hình bảo mật .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const postsDirectory = path.join(process.cwd(), "content/posts");

// 2. CHỈ ĐỊNH ĐÍCH DANH ĐẶC VỤ KEY 25 CHẠY RIÊNG LÚC 00:00 UTC
const SINGLE_AGGREGATE_KEY = process.env.GEMINI_API_KEY_25 || process.env.GEMINI_API_KEY || "";

async function generateTopCollection(topicLine: string) {
  if (!SINGLE_AGGREGATE_KEY) {
    console.error("❌ Lỗi: Không tìm thấy cấu hình biến môi trường GEMINI_API_KEY_25!");
    return false;
  }

  // Tự động bốc con số mốc chẵn nằm trong dòng tiêu đề (Ví dụ: 10, 20, 30...)
  const milestoneMatch = topicLine.match(/\b(10|20|30|40|50)\b/);
  const milestone = milestoneMatch ? milestoneMatch[1] : "10";

  // Tự động bốc vai trò công việc ở cuối câu để AI biết đường nghiên cứu đúng đối tượng
  const roleMatch = topicLine.match(/for\s+(.+)$/i);
  const rawRole = roleMatch ? roleMatch[1].trim() : "QA Engineer";

  const genAI = new GoogleGenerativeAI(SINGLE_AGGREGATE_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

  // PROMPT ĐÃ ĐƯỢC NÂNG CẤP BỘ NÃO NGHIÊN CỨU SÂU (RESEARCH-BASED)
  const prompt = `
    You are an elite Tech Headhunter, a Principal QA Consultant, and a world-class career coach.
    Your task is to generate a high-yield, straight-to-the-point interview compilation guide titled exact: "${topicLine}".
    
    CRITICAL MANDATE (INTERVIEW SOURCE RESEARCH):
    Do not just invent generic questions. You must simulate a deep-dive research into real-world interview data from sources like Glassdoor, LinkedIn Interview Insights, LeetCode discussion boards, Tech-company engineering blogs, and senior QA community repos.
    Select exactly the ${milestone} MOST FREQUENTLY ASKED, high-probability, and battle-tested interview questions specifically targeted for a "${rawRole}". Every single question must represent a realistic scenario that candidates actually face in mid-to-high tier technical interviews (e.g., FAANG, Tier-1 Tech Hubs, Fintech, Enterprise SaaS).

    STRICT FORMAT REQUIREMENT:
    The entire output MUST be in raw Markdown format. Do not wrap the whole response in code blocks like \`\`\`markdown.
    The structure MUST strictly follow this exact template below:

    # ${topicLine}

    ## Overview
    [Provide a concise 2-sentence introduction about the core challenge of this role and what this guide covers]

    ## Purpose
    [Provide a 2-sentence explanation of the strategic purpose of this compilation and how it prepares candidates for success]

    [Generate exactly ${milestone} curated real-world questions and answers sequentially using the exact format below. Do not add any extra sections like Frontmatter, Speaking Blueprints, or Metadata tags]

    ### Question 1: [Insert the curated high-frequency question here - STRICTLY UNDER 200 characters]
    **Answer:** [Insert a cohesive, structured answer written entirely in conversational, professional spoken English (Văn nói). The candidate must be able to use this exact text to speak fluently for about 3 minutes during an interview. It must sound natural, confident, and packed with industry metrics/frameworks (e.g., STAR technique, Risk-Based matrices, DoR/DoD alignment). Focus on high-level strategy, real problem-solving, and engineering impact. STRICT LENGTH LIMIT: Between 1500 and 2000 characters.]

    ### Question 2: [Insert the next curated high-frequency question here - STRICTLY UNDER 200 characters]
    **Answer:** [Insert answer here following the exact same guidelines, between 1500 and 2000 characters in spoken English.]
  `;

  try {
    console.log(`🤖 [Key 25 Nghiên Cứu Sâu] Đang phân tích nguồn phỏng vấn thực tế và gộp bài cho chủ đề: "${topicLine}"...`);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Làm sạch Markdown đầu ra
    const cleanMarkdown = responseText.replace(/^```markdown\n/, "").replace(/\n```$/, "");
    const fileName = `${topicLine.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;

    if (!fs.existsSync(postsDirectory)) fs.mkdirSync(postsDirectory, { recursive: true });

    const outputPath = path.join(postsDirectory, fileName);
    fs.writeFileSync(outputPath, cleanMarkdown, "utf-8");
    console.log(`✅ [SUCCESS] Đã xuất bản thành công Bộ Đề Tinh Hoa Cực VIP: /content/posts/${fileName}`);
    return true;
  } catch (error) {
    console.error(`❌ Gặp lỗi xử lý API tại chủ đề bài Top [${topicLine}]:`, error);
    return false;
  }
}

async function main() {
  const filePath = path.join(process.cwd(), "topics_top.txt");
  const doneFilePath = path.join(process.cwd(), "done_topics_top.txt");

  if (!fs.existsSync(filePath)) {
    console.error("❌ Lỗi hệ thống: Không tìm thấy file danh sách bài Top topics_top.txt!");
    process.exit(1);
  }

  const lines = fs.readFileSync(filePath, "utf-8").split("\n").map(line => line.trim());
  const validTopics = lines.filter(line => line.length > 0);

  if (validTopics.length === 0) {
    console.log("🎉 Hết bài gộp rồi sếp ơi! File topics_top.txt hiện đang trống.");
    return;
  }

  // Bốc chính xác dòng đầu tiên của topics_top.txt mang đi đóng hộp
  const currentTopic = validTopics[0];
  const success = await generateTopCollection(currentTopic);

  if (success) {
    // Đẩy dòng đã hoàn thành vào file done_topics_top.txt
    fs.appendFileSync(doneFilePath, `${currentTopic}\n`, "utf-8");
    
    // Cắt dòng đó khỏi file topics_top.txt gốc
    const targetIndex = lines.findIndex(l => l.trim() === currentTopic);
    if (targetIndex !== -1) lines.splice(targetIndex, 1);
    fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
    
    console.log(`✂️ Đã cắt dòng. Kho topics_top.txt còn lại: ${validTopics.length - 1} chủ đề.`);
  } else {
    console.log("⚠️ Thất bại, giữ nguyên đầu dòng cho ngày hôm sau thử lại.");
  }
}

main();