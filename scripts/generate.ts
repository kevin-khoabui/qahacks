import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// ============================================================================
// 🎯 BẢNG ĐIỀU KHIỂN CHUYỂN HỆ CHẾ ĐỘ: 'MANUAL_LEADER' hoặc 'TECHNICAL'
// Hiện tại đang khóa ở chế độ Manual QA Lead. Sau này muốn viết Automation/Technical thì đổi.
// ============================================================================
const CURRENT_MODE: 'MANUAL_LEADER' | 'TECHNICAL' = 'MANUAL_LEADER';

function getTargetApiKey(keyNumber: number): string {
  return process.env[`GEMINI_API_KEY_${keyNumber}`] || "";
}

function getPromptByMode(topic: string): string {
  if (CURRENT_MODE === 'TECHNICAL') {
    return `
      You are an elite Technical Interviewer and a Principal Automation Architect.
      Generate a high-yield, tech-heavy interview Q&A post based on this technical/automation topic: "${topic}".
      
      CRITICAL REQUIREMENT 1 (STRICT LENGTH & CODE STYLE):
      - The "Interview Question" must be a sharp, technical, or coding-challenge question (Strictly under 200 characters).
      - The "Expert Answer" must be a highly structured technical breakdown (Strictly under 2500 characters). Focus on implementation details, best practices, and architecture. You may use small, clean markdown code blocks if necessary.
      - You MUST include a "Speaking Blueprint (3-Minute Verbal Response)" section. This is a word-for-word spoken script in fluent, professional corporate English.

      CRITICAL REQUIREMENT 2 (TECHNICAL SIGNPOSTING):
      The Speaking Blueprint MUST sound like a seasoned Tech Lead explaining their technical implementation or architecture to a Lead Architect or CTO. Strictly follow this conversational flow without bullet points:
      1. [The Hook]: Start with a powerful statement regarding scalability, engineering efficiency, or modern architecture framework.
      2. [The Core Execution]: Walk through the technical execution using natural signposting.
      3. [The Punchline]: Conclude with a definitive philosophy on technical scalability, maintainability, or the ultimate engineering ROI.

      CRITICAL REQUIREMENT 3 (AUTOMATIC TAXONOMY MAPPING):
      Analyze the topic and strictly map the metadata according to our technical guidelines:
      - "category": Must be 'Technical'.
      - "sub_category": Must map logically to ['Automation', 'API', 'Database', 'Performance', 'Security', 'DevOps'].
      - "difficulty": Set dynamically based on complexity ('Intermediate' or 'Advanced').
      - "target_role": Set logically ('QA_Engineer', 'Senior_Automation', 'DevOps_QA').
      - "tool_stack": Identify the main tool used (e.g., 'Playwright', 'Cypress', 'JMeter', 'Postman', 'SQL', 'Docker'). If no tool is used, set 'None'.

      CRITICAL REQUIREMENT 4 (OUTPUT FORMAT):
      The entire output MUST be in raw Markdown format and MUST start with the exact Frontmatter structure below. Do not wrap the frontmatter or the whole response in markdown code blocks.

      ---
      title: 'A concise, tech-heavy, and SEO-optimized title tailored for the coding or automation topic'
      difficulty: '[Insert Dynamic Value]'
      target_role: '[Insert Dynamic Value]'
      category: 'Technical'
      sub_category: '[Insert Dynamic Value]'
      question_type: 'Code-challenge'
      core_testing_type: 'Automation'
      domain: 'Enterprise-Software'
      platform: 'Web'
      tool_stack: '[Insert Dynamic Value]'
      tags: ['automation', 'coding-challenge', 'interview-prep', 'tech-strategy']
      ---
      
      ## Overview
      [Provide a brief 2-sentence technical introduction highlighting the core engineering challenge of this specific topic]
      
      ### Interview Question:
      [Insert the short technical question here, under 200 characters]
      
      ### Expert Answer:
      [Insert the structured written answer here. Focus on code quality, framework structure, and technical execution]

      ### Speaking Blueprint (3-Minute Verbal Response):
      [Insert the conversational speech sample here, clearly embedding markers for [The Hook], [The Core Execution], and [The Punchline] naturally within the narrative flow]
    `;
  }

  // ============================================================================
  // 🚀 PROMPT MANUAL LEAD (CỰC PHẨM THỰC CHIẾN TỪ SẾP)
  // ============================================================================
  return `
    You are an elite QA Software Test Lead, Manual Software Test Lead, and Senior Engineering Interviewer.
    Generate a high-quality interview Q&A post tailored specifically for a QA Lead role based on this manual testing topic: "${topic}".
    
    CRITICAL REQUIREMENT 1 (QA LEAD FOCUS)
    The response must evaluate a candidate's ability to:
    - Lead QA execution across a project
    - Coordinate testing activities
    - Mentor QA Engineers
    - Manage testing risks
    - Drive release readiness
    - Collaborate with Developers, Product Managers, and Business Analysts
    - Handle delivery pressure and changing priorities
    - Avoid enterprise governance discussions that belong to QA Manager responsibilities.
    
    CRITICAL REQUIREMENT 2 (QUESTION DESIGN)
    The Interview Question must:
    - Be situational or behavioral
    - Be under 200 characters
    - Reflect a real testing leadership challenge
    - Require prioritization and decision-making
    - Avoid theoretical definitions
    
    CRITICAL REQUIREMENT 3 (EXPERT ANSWER)
    The Expert Answer must:
    - Be under 2500 characters
    - Demonstrate test leadership
    - Show practical execution strategy
    - Explain risk identification and mitigation
    - Include delegation strategy
    - Include stakeholder communication
    - Include release decision criteria
    - Use clean Markdown formatting.
    - No code blocks.
    
    CRITICAL REQUIREMENT 4 (QA LEAD METRICS)
    Reference relevant delivery metrics where appropriate:
    - Defect Leakage Rate
    - Defect Reopen Rate
    - Test Execution Progress
    - Requirement Coverage
    - Regression Coverage
    - UAT Pass Rate
    Explain how the metrics influence testing decisions.
    
    CRITICAL REQUIREMENT 5 (SPEAKING BLUEPRINT)
    Provide a 3-minute verbal response.
    The speech must sound like a QA Lead speaking to an Engineering Manager or Delivery Manager.
    Structure:
    1. [The Hook]: Present the testing challenge and quality risk.
    2. [The Core Execution]: Explain execution strategy, team coordination, prioritization, communication, and risk mitigation.
    3. [The Punchline]: Summarize leadership philosophy and delivery impact.
    
    CRITICAL REQUIREMENT 6 (TAXONOMY)
    Map metadata dynamically. MUST strictly use these values:
    - category: Must be one of ['Analytical_Behavioral', 'Technical']
    - sub_category: Must be one of ['Strategy', 'Methodology', 'Behavioral']
    - difficulty: 'Advanced'
    - target_role: 'QA Lead'
    - tool_stack: 'None'
    
    CRITICAL REQUIREMENT 7 (OUTPUT FORMAT)
    Return raw Markdown beginning with frontmatter. Do not wrap the frontmatter or the whole response in markdown code blocks.
    
    ---
    title: 'An executive, SEO-optimized title tailored for a QA Lead interview challenge'
    difficulty: 'Advanced'
    target_role: 'QA Lead'
    category: '[Insert Dynamic Value]'
    sub_category: '[Insert Dynamic Value]'
    question_type: 'Situational'
    core_testing_type: 'Manual'
    domain: 'Enterprise-Software'
    platform: 'Cross-platform'
    tool_stack: 'None'
    leadership_competency: '[Insert e.g., Risk Mitigation, Stakeholder Management, Team Mentorship]'
    interview_focus: '[Insert e.g., Delivery Pressure, Resource Allocation]'
    tags: ['manual-testing', 'qa-lead', 'interview-prep', 'test-leadership']
    ---
    
    ## Overview
    [Provide a brief 2-sentence executive summary highlighting the high-stakes risk and leadership challenge]
    
    ### Interview Question:
    [Insert the situational leadership question here, under 200 characters]
    
    ### Expert Answer:
    [Insert the structured, strategic framework answer here focusing on QA Lead execution and metrics]

    ### Speaking Blueprint (3-Minute Verbal Response):
    [Insert the conversational speech sample here, clearly embedding markers for [The Hook], [The Core Execution], and [The Punchline]]
  `;
}

async function generateInterviewQuestion(rawTopic: string, keyNumber: number) {
  const apiKey = getTargetApiKey(keyNumber);
  if (!apiKey) {
    console.error(`❌ Lỗi: Không tìm thấy biến cấu hình GEMINI_API_KEY_${keyNumber}!`);
    return false;
  }

  // 🛠️ Gọt bỏ hoàn toàn dấu nháy kép dư thừa ở đầu/cuối do shell truyền sang
  const topic = rawTopic.replace(/^"|"$/g, "").trim();

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = getPromptByMode(topic);

    console.log(`🤖 [Băng chuyền - Chế độ: ${CURRENT_MODE}] Key [${keyNumber}] đang xử lý: "${topic.substring(0, 60)}..."`);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanMarkdown = responseText.replace(/^```markdown\n/, "").replace(/\n```$/, "");
    
    // 🛠️ Dọn sạch mọi ký tự lạ, biến câu dài thành tên file-gạch-ngang an toàn
    const fileName = topic
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") 
      .replace(/\s+/g, "-")          
      .replace(/-+/g, "-")           
      .trim() + ".md";

    const outputDir = path.join(process.cwd(), "content", "posts");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, fileName);
    fs.writeFileSync(outputPath, cleanMarkdown, "utf-8");
    console.log(`✅ [PASS] Xuất file thành công: ${fileName}`);
    return true;
  } catch (error) {
    console.error(`⚠️ [FAIL] Key [${keyNumber}] thất bại do dính hạn ngạch hoặc lỗi kết nối.`, error);
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