import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

function getTargetApiKey(keyNumber: number): string {
  return process.env[`GEMINI_API_KEY_${keyNumber}`] || "";
}

// ============================================================================
// 🤖 BỘ PHÁT SINH PROMPT ĐỘNG THEO TỪNG THỂ LOẠI (STRATEGY PATTERN)
// ============================================================================
function getPromptByStrategy(topic: string, isAutomation: boolean, rolesString: string, categoriesString: string): string {
  if (isAutomation) {
    // ⚡ PROMPT DÀNH CHO CÁC VAI TRÒ AUTOMATION (ENGINEER & LEADER)
    return `
      You are an elite Technical Interviewer and a Principal Automation Architect specializing in Automation Testing frameworks.
      Generate a high-yield, tech-heavy interview Q&A post based on this technical automation topic: "${topic}".
      
      CRITICAL REQUIREMENT 1 (STRICT LENGTH & CODE STYLE):
      - The "Interview Question" must be a sharp, technical, or architecture-challenge question.
      - The "Expert Answer" must be a highly structured technical breakdown (Strictly under 2500 characters). Focus on implementation details, automation best practices, and script/framework architecture. You may use small, clean markdown code blocks if necessary.
      - You MUST include a "Speaking Blueprint (3-Minute Verbal Response)" section. This is a word-for-word spoken script in fluent, professional corporate English.

      CRITICAL REQUIREMENT 2 (TECHNICAL SIGNPOSTING):
      The Speaking Blueprint MUST sound like a seasoned Automation Specialist or Automation Lead explaining their technical execution to a CTO or Principal Architect. Follow this conversational flow naturally without bullet points:
      1. [The Hook]: Start with a powerful statement regarding testing scalability, engineering efficiency, or modern automation frameworks (Playwright, Cypress, CI/CD).
      2. [The Core Execution]: Walk through the technical execution or framework design using natural signposting.
      3. [The Punchline]: Conclude with a definitive philosophy on technical scalability, test maintainability, or the ultimate engineering ROI.

      CRITICAL REQUIREMENT 3 (HARDCODED MULTI-TAG MAPPING):
      You MUST strictly write the exact array values provided below into the Frontmatter block. Do not attempt to guess or alter them:
      - "target_role": ${rolesString}
      - "category": ${categoriesString}

      CRITICAL REQUIREMENT 4 (QUESTION DESIGN)
      - IMPORTANT: Use the exact raw input "${topic}" as your primary Interview Question. Do not invent a different scenario or rewrite it.

      CRITICAL REQUIREMENT 5 (OUTPUT FORMAT):
      The entire output MUST be in raw Markdown format and MUST start with the exact Frontmatter structure below. Do not wrap the frontmatter or the whole response in markdown code blocks.
      THE "title" IN THE FRONTMATTER MUST BE THE EXACT SAME TEXT AS THE INTERVIEW QUESTION ("${topic}").

      ---
      title: "${topic}"
      difficulty: "Advanced"
      target_role: ${rolesString}
      category: ${categoriesString}
      sub_category: "Automation"
      question_type: "Code-challenge"
      core_testing_type: "Automation"
      domain: "Enterprise-Software"
      platform: "Cross-platform"
      tool_stack: "None"
      tags: ["automation", "coding-challenge", "interview-prep", "tech-strategy"]
      ---
      
      ## Overview
      [Provide a brief 2-sentence technical introduction highlighting the core automation framework challenge of this specific topic]
      
      ### Interview Question:
      ${topic}
      
      ### Expert Answer:
      [Insert the structured written automation answer here. Focus on code quality, design patterns like Page Object Model or Appium strategies, and execution velocity]

      ### Speaking Blueprint (3-Minute Verbal Response):
      [Insert the conversational speech sample here, clearly embedding markers for [The Hook], [The Core Execution], and [The Punchline] naturally within the narrative flow]
    `;
  }

  // 📋 PROMPT DÀNH CHO CÁC VAI TRÒ MANUAL (ENGINEER & LEADER)
  return `
    You are an elite QA Software Test Lead and a Senior Engineering Interviewer specialized in Manual Testing & Quality Strategies.
    Generate a high-quality interview Q&A post tailored specifically for this manual testing topic: "${topic}".
    
    CRITICAL REQUIREMENT 1 (MANUAL & LEADERSHIP FOCUS)
    The response must evaluate a candidate's ability to:
    - Coordinate testing activities, manage testing risks, and drive release readiness.
    - Perform deep functional, exploratory, or regression analysis without relying on code.
    - Collaborate with Developers, Product Managers, and Business Analysts to handle delivery pressure.
    
    CRITICAL REQUIREMENT 2 (QUESTION DESIGN)
    - IMPORTANT: Use the exact raw input "${topic}" as your primary Interview Question. Do not invent a different scenario or rewrite it.
    
    CRITICAL REQUIREMENT 3 (EXPERT ANSWER)
    The Expert Answer must:
    - Be under 2500 characters.
    - Demonstrate structured test design, practical execution strategy, and risk mitigation.
    - Use clean Markdown formatting. Absolutely NO code blocks.
    
    CRITICAL REQUIREMENT 4 (QA LEAD & ENGINEER METRICS)
    Reference relevant delivery metrics where appropriate: Defect Leakage Rate, Defect Reopen Rate, Test Execution Progress, Requirement Coverage, or UAT Pass Rate. Explain how these metrics influence testing decisions.
    
    CRITICAL REQUIREMENT 5 (SPEAKING BLUEPRINT)
    Provide a 3-minute verbal response. The speech must sound like a professional QA specialist speaking to a Delivery Manager or Engineering Director.
    Structure:
    1. [The Hook]: Present the core testing challenge and quality risk.
    2. [The Core Execution]: Explain strategy, team coordination, prioritization, and communication.
    3. [The Punchline]: Summarize quality philosophy and delivery impact.
    
    CRITICAL REQUIREMENT 6 (HARDCODED MULTI-TAG MAPPING)
    You MUST strictly write the exact array values provided below into the Frontmatter block. Do not attempt to guess or alter them:
    - "target_role": ${rolesString}
    - "category": ${categoriesString}
    
    CRITICAL REQUIREMENT 7 (OUTPUT FORMAT)
    Return raw Markdown beginning with frontmatter. Do not wrap the frontmatter or the whole response in markdown code blocks.
    THE "title" IN THE FRONTMATTER MUST BE THE EXACT SAME TEXT AS THE INTERVIEW QUESTION ("${topic}").

    ---
    title: "${topic}"
    difficulty: "Advanced"
    target_role: ${rolesString}
    category: ${categoriesString}
    sub_category: "Strategy"
    question_type: "Situational"
    core_testing_type: "Manual"
    domain: "Enterprise-Software"
    platform: "Cross-platform"
    tool_stack: "None"
    leadership_competency: "Risk Mitigation"
    interview_focus: "Delivery Pressure"
    tags: ["manual-testing", "qa-lead", "interview-prep", "test-leadership"]
    ---
    
    ## Overview
    [Provide a brief 2-sentence executive summary highlighting the testing risk and strategic challenge]
    
    ### Interview Question:
    ${topic}
    
    ### Expert Answer:
    [Insert the structured, strategic framework answer here focusing on manual QA execution, coverage, and validation metrics]

    ### Speaking Blueprint (3-Minute Verbal Response):
    [Insert the conversational speech sample here, clearly embedding markers for [The Hook], [The Core Execution], and [The Punchline]]
  `;
}

async function generateInterviewQuestion(topic: string, keyNumber: number) {
  let targetRoles: string[] = ["Manual_QA_Engineer"];
  let coreCategories: string[] = ["Leadership"];
  let actualQuestion = topic;

  if (topic.includes("-") && topic.includes("|")) {
    try {
      const dashIndex = topic.indexOf("-");
      const metadataPart = topic.substring(0, dashIndex).trim();
      actualQuestion = topic.substring(dashIndex + 1).trim();

      const pipeParts = metadataPart.split("|").map(p => p.trim());
      if (pipeParts[0]) {
        targetRoles = pipeParts[0].split(",").map(r => r.trim().replace(/\s+/g, "_")).filter(r => r.length > 0);
      }
      if (pipeParts[1]) {
        coreCategories = pipeParts[1].split(",").map(c => c.trim().replace(/\s+/g, "_")).filter(c => c.length > 0);
      }
    } catch (e) {
      console.warn("⚠️ Lỗi bốc tách chuỗi đa thẻ, dùng cấu hình mặc định.");
    }
  }

  // ============================================================================
  // 🛡️ [KIỂM TRA TRÙNG LẶP SỚM] - KIỂM TRA TRƯỚC KHI GỌI API GEMINI
  // ============================================================================
  const coreSlug = actualQuestion
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const outputDir = path.join(process.cwd(), "content", "posts");
  const fileName = `${coreSlug}.md`;
  const outputPath = path.join(outputDir, fileName);

  if (fs.existsSync(outputPath)) {
    console.log(`🛑 [BỎ QUA] File bài viết đã tồn tại: ${fileName}. Không tạo file mới, không thêm số.`);
    // Trả về true để hệ thống tự động kích hoạt bộ lọc xóa dòng này ra khỏi topics.txt
    return true; 
  }

  // ============================================================================
  // Lấy API key và gọi Gemini (Giữ nguyên logic cũ nhưng bỏ đoạn kiểm tra file ở cuối)
  // ============================================================================
  const isAutomation = targetRoles.some(role => role.toLowerCase().includes("automation"));
  const rolesString = JSON.stringify(targetRoles);
  const categoriesString = JSON.stringify(coreCategories);

  console.log(`🏷️  [Nhận Diện Động] Nhóm: [${isAutomation ? "AUTOMATION" : "MANUAL"}] | Roles: ${rolesString} | Categories: ${categoriesString}`);

  const apiKey = getTargetApiKey(keyNumber);
  if (!apiKey) {
    console.error(`❌ Không tìm thấy API Key số: ${keyNumber}`);
    return false;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = getPromptByStrategy(actualQuestion, isAutomation, rolesString, categoriesString);

  try {
    console.log(`🤖 Đang gửi câu hỏi lên Gemini: "${actualQuestion.slice(0, 60)}..."`);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const cleanMarkdown = responseText
      .replace(/^```[a-zA-Z]*\n/, "") 
      .replace(/\n```$/, "")           
      .trim();

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    fs.writeFileSync(outputPath, cleanMarkdown, "utf-8");
    console.log(`✅ [PASS] Xuất URL nguyên bản thành công: ${fileName}`);
    return true;
  } catch (error) {
    console.error(`⚠️ [FAIL] Thất bại tại chủ đề [${actualQuestion.slice(0, 30)}]:`, error);
    return false;
  }
}

async function main() {
  const keyArgument = process.argv[2];
  const topicArgument = process.argv[3];
  const keyNumber = keyArgument ? parseInt(keyArgument, 10) : 1;

  if (!topicArgument) {
    console.error("❌ Lỗi: Không nhận được tham số chủ đề từ bộ điều phối!");
    process.exit(1);
  }

  const doneFilePath = path.join(process.cwd(), "done_topics.txt");
  const success = await generateInterviewQuestion(topicArgument, keyNumber);

  if (success) {
    fs.appendFileSync(doneFilePath, `${topicArgument}\n`, "utf-8");
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main();