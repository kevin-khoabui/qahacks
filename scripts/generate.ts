import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Nạp cấu hình bảo mật .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// 2. DANH SÁCH BỂ CHỨA API KEY - GIỮ ĐỦ TRỌN BỘ 24 KEYS CHẠY TIẾN
const API_KEYS_POOL = [
  process.env.GEMINI_API_KEY_1 || "", process.env.GEMINI_API_KEY_2 || "", process.env.GEMINI_API_KEY_3 || "",
  process.env.GEMINI_API_KEY_4 || "", process.env.GEMINI_API_KEY_5 || "", process.env.GEMINI_API_KEY_6 || "",
  process.env.GEMINI_API_KEY_7 || "", process.env.GEMINI_API_KEY_8 || "", process.env.GEMINI_API_KEY_9 || "",
  process.env.GEMINI_API_KEY_10 || "", process.env.GEMINI_API_KEY_11 || "", process.env.GEMINI_API_KEY_12 || "",
  process.env.GEMINI_API_KEY_13 || "", process.env.GEMINI_API_KEY_14 || "", process.env.GEMINI_API_KEY_15 || "",
  process.env.GEMINI_API_KEY_16 || "", process.env.GEMINI_API_KEY_17 || "", process.env.GEMINI_API_KEY_18 || "",
  process.env.GEMINI_API_KEY_19 || "", process.env.GEMINI_API_KEY_20 || "", process.env.GEMINI_API_KEY_21 || "",
  process.env.GEMINI_API_KEY_22 || "", process.env.GEMINI_API_KEY_23 || "", process.env.GEMINI_API_KEY_24 || "",
].filter(key => key.length > 0);

function getRotatedApiKey(): string {
  if (API_KEYS_POOL.length === 0) return process.env.GEMINI_API_KEY || "";

  const pointerPath = path.join(process.cwd(), "pointer.json");
  let currentIndex = 0;

  if (fs.existsSync(pointerPath)) {
    try {
      currentIndex = JSON.parse(fs.readFileSync(pointerPath, "utf-8")).currentIndex || 0;
    } catch (e) {
      currentIndex = 0;
    }
  }

  const selectedKey = API_KEYS_POOL[currentIndex % API_KEYS_POOL.length];
  const nextIndex = (currentIndex + 1) % API_KEYS_POOL.length;
  fs.writeFileSync(pointerPath, JSON.stringify({ currentIndex: nextIndex }), "utf-8");

  console.log(`🔑 [Bài lẻ hằng giờ] Đang xoay vòng sử dụng Key cấp tiến [Vị trí: ${currentIndex + 1}/${API_KEYS_POOL.length}]`);
  return selectedKey;
}

async function generateInterviewQuestion(topic: string) {
  const apiKey = getRotatedApiKey();
  if (!apiKey) {
    console.error("❌ Lỗi: Không tìm thấy bất kỳ API Key hợp lệ nào!");
    return false;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

  const prompt = `
    You are an expert Technical Interviewer and a Principal QA Engineer.
    Generate a high-yield, straight-to-the-point interview Q&A post regarding this topic: "${topic}".
    
    CRITICAL REQUIREMENT 1 (STRICT LENGTH & STYLE LIMITS):
    - The "Interview Question" must be a concise, direct, one-to-two sentence question (Strictly under 200 characters).
    - The "Expert Answer" must be concise, structured, and strictly under 2500 characters. Focus on high-level strategy (Problem-solving, Impact, Resolution) using clean markdown formatting (bolding, short lists) but NO massive code blocks.
    - You MUST include a "Speaking Blueprint (3-Minute Verbal Response)" section. This section must be a word-for-word spoken script in professional English.

    CRITICAL REQUIREMENT 2 (SPEAKING STRUCTURE & SIGNPOSTING):
    The Speaking Blueprint MUST strictly follow this conversational structure without using mechanical bullet points:
    1. [The Hook]: Start with a powerful, direct statement or viewpoint about the topic to grab attention immediately.
    2. [The Core Execution]: Transition smoothly into the core solution. You MUST use natural signposting techniques (e.g., "First, the way I look at this...", "This directly drives us to the next point...", "Now, to make this actionable...", "We actually ran into a similar scenario where...").
    3. [The Punchline]: Conclude with a strong, high-level engineering philosophy or the direct business value this strategy delivers to the enterprise.

    CRITICAL REQUIREMENT 3 (AUTOMATIC TAXONOMY MAPPING):
    Determine the correct metadata values based on our strict system architecture guidelines:
    - "category": Must be one of ['Technical', 'Foundations', 'Analytical_Behavioral'].
    - "sub_category": Must map logically (e.g., 'Automation', 'API', 'Database', 'Performance', 'Security', 'Manual', 'Methodology', 'Strategy', 'Behavioral').
    - "difficulty": Set 'Basic', 'Intermediate', or 'Advanced'.
    - "target_role": Determine the realistic industry role (e.g., 'Junior_QA_Engineer', 'QA_Engineer', 'Senior_Automation', 'QA_Lead', 'QA_Manager', 'QA_Data_Analyst').
    - "tool_stack": Identify the main tool used ('Playwright', 'Cypress', 'JMeter', 'Postman', 'SQL', or 'None').

    CRITICAL REQUIREMENT 4 (OUTPUT FORMAT):
    The entire output MUST be in raw Markdown format and MUST start with the exact Frontmatter structure below. Do not wrap the frontmatter or the whole response in code blocks.

    ---
    title: 'A concise, catchy, and SEO-optimized title tailored for the post'
    difficulty: '[Insert Dynamic Value]'
    target_role: '[Insert Dynamic Value]'
    category: '[Insert Dynamic Value]'
    sub_category: '[Insert Dynamic Value]'
    question_type: 'Code-challenge'
    core_testing_type: 'Functional'
    domain: 'E-commerce'
    platform: 'Web'
    tool_stack: '[Insert Dynamic Value]'
    tags: ['testing', 'interview-prep', 'qa-interview']
    ---
    
    ## Overview
    [Provide a very brief 2-sentence introduction about the core challenge of this topic]
    
    ### Interview Question:
    [Insert the short question here, under 200 characters]
    
    ### Expert Answer:
    [Insert the structured, punchy written answer here. Focus on problem-solving, impact, and concrete real-world logic]

    ### Speaking Blueprint (3-Minute Verbal Response):
    [Insert the conversational speech sample here, using clear markers for [The Hook], [The Core Execution], and [The Punchline] inside the text flow]
  `;

  try {
    console.log(`🤖 [Băng chuyền Hằng Giờ] Đang gửi chủ đề lên Gemini: "${topic}"...`);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanMarkdown = responseText.replace(/^```markdown\n/, "").replace(/\n```$/, "");
    const fileName = `${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;

    const outputDir = path.join(process.cwd(), "content", "posts");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, fileName);
    fs.writeFileSync(outputPath, cleanMarkdown, "utf-8");
    console.log("✅ Xuất file bài lẻ thành công.");
    return true;
  } catch (error) {
    console.error(`❌ Gặp lỗi xử lý API tại chủ đề [${topic}]:`, error);
    return false;
  }
}

async function main() {
  const argumentTopic = process.argv[2];
  if (argumentTopic) {
    await generateInterviewQuestion(argumentTopic);
  } else {
    const filePath = path.join(process.cwd(), "topics.txt");
    const doneFilePath = path.join(process.cwd(), "done_topics.txt");

    if (!fs.existsSync(filePath)) {
      console.error("❌ Lỗi: Không tìm thấy file topics.txt!");
      process.exit(1);
    }

    const lines = fs.readFileSync(filePath, "utf-8").split("\n").map(line => line.trim());
    const validTopics = lines.filter(line => line.length > 0);

    if (validTopics.length === 0) {
      console.log("🎉 Hết bài rồi! File topics.txt trống.");
      return;
    }

    const currentTopic = validTopics[0];
    const success = await generateInterviewQuestion(currentTopic);

    if (success) {
      fs.appendFileSync(doneFilePath, `${currentTopic}\n`, "utf-8");
      const targetIndex = lines.findIndex(l => l.trim() === currentTopic);
      if (targetIndex !== -1) lines.splice(targetIndex, 1);
      fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
      console.log(`✂️ Đã cắt dòng. Còn lại: ${validTopics.length - 1} chủ đề.`);
    } else {
      console.log("⚠️ Thất bại, giữ nguyên đầu dòng.");
    }
  }
}

main();