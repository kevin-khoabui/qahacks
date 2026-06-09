import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

function getTargetApiKey(keyNumber: number): string {
  return process.env[`GEMINI_API_KEY_${keyNumber}`] || "";
}

async function generateInterviewQuestion(topic: string, keyNumber: number) {
  const apiKey = getTargetApiKey(keyNumber);
  if (!apiKey) {
    console.error(`❌ Lỗi: Không tìm thấy biến cấu hình GEMINI_API_KEY_${keyNumber}!`);
    return false;
  }

  try {
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

    console.log(`🤖 [Băng chuyền] Key [${keyNumber}] đang xử lý chủ đề: "${topic.substring(0, 60)}..."`);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanMarkdown = responseText.replace(/^```markdown\n/, "").replace(/\n```$/, "");
    const fileName = `${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;

    const outputDir = path.join(process.cwd(), "content", "posts");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, fileName);
    fs.writeFileSync(outputPath, cleanMarkdown, "utf-8");
    console.log(`✅ [PASS] Xuất file thành công bằng Key [${keyNumber}].`);
    return true;
  } catch (error) {
    console.error(`⚠️ [FAIL] Key [${keyNumber}] thất bại do dính hạn ngạch hoặc lỗi kết nối.`);
    return false;
  }
}

async function main() {
  const keyArgument = process.argv[2];
  const topicArgument = process.argv[3];
  
  const keyNumber = keyArgument ? parseInt(keyArgument, 10) : 1;

  if (!topicArgument) {
    console.error("❌ Lỗi: Không nhận được tham số chủ đề từ bộ chỉ huy!");
    process.exit(1);
  }

  const doneFilePath = path.join(process.cwd(), "done_topics.txt");
  const success = await generateInterviewQuestion(topicArgument, keyNumber);

  if (success) {
    fs.appendFileSync(doneFilePath, `${topicArgument}\n`, "utf-8");
    process.exit(0); // Trả về mã code thành công để bộ điều phối biết đường xóa dòng
  } else {
    process.exit(1); // Trả về mã thất bại để bộ chỉ huy giữ lại dòng đạn lỗi
  }
}

main();