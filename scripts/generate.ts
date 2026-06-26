import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

function getTargetApiKey(keyNumber: number): string {
  return process.env[`GEMINI_API_KEY_${keyNumber}`] || "";
}

// Hàm Retry Mechanism: Thử lại tối đa 3 lần nếu gặp lỗi
async function generateWithRetry(model: any, prompt: string, retries = 3): Promise<string> {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.warn(`⚠️ Lỗi API, đang thử lại lần ${i + 2}...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  return "";
}

function getPromptByStrategy(topic: string, role: string, difficulty: string, categories: string): string {
  const safeTopic = topic.replace(/"/g, '\\"');
  
  // Base configuration
  const frontmatter = `
---
title: "${safeTopic}"
difficulty: "${difficulty}" 
target_role: ["${role}"]
category: ${categories}
---`;

  // 1. Prompt cho Software Engineer (Tư duy Dev)
  if (role === "Software_Engineer") {
    return `${frontmatter}
    You are a Senior Software Engineer. Explain this topic: "${safeTopic}".
    - Focus: Design patterns, Clean Code, Unit/Integration testing, System Architecture, Code Review standards.
    - Speaking Blueprint: Professional language to a Tech Lead/CTO.
    ### Interview Question: ${safeTopic}
    ### Expert Answer: [Focus on development logic, architectural trade-offs]
    ### Speaking Blueprint: [The Hook, The Core Execution, The Punchline]`;
  }

  // 2. Prompt cho Automation QA Engineer (Tư duy Framework/Tools)
  if (role === "Automation_QA_Engineer") {
    return `${frontmatter}
    You are an Automation Architect. Explain this topic: "${safeTopic}".
    - Focus: Test Framework (Playwright/Cypress/Selenium), CI/CD pipelines, Test maintainability, Scalability.
    - Speaking Blueprint: Technical explanation to an Engineering Manager.
    ### Interview Question: ${safeTopic}
    ### Expert Answer: [Focus on code implementation, POM, automation best practices]
    ### Speaking Blueprint: [The Hook, The Core Execution, The Punchline]`;
  }

  // 3. Prompt cho QA Leader (Tư duy Quản lý/Chiến lược)
  if (role === "QA_Leader") {
    return `${frontmatter}
    You are a QA Manager/Test Lead. Explain this topic: "${safeTopic}".
    - Focus: Quality Strategy, Risk Mitigation, Delivery Metrics (Defect Leakage/Reopen Rate), Process improvement.
    - Speaking Blueprint: Executive language to a Delivery Manager.
    ### Interview Question: ${safeTopic}
    ### Expert Answer: [Focus on strategic planning, leadership, team coordination]
    ### Speaking Blueprint: [The Hook, The Core Execution, The Punchline]`;
  }

  // 4. Prompt cho Manual QA Engineer (Tư duy Kiểm thử/Exploratory)
  return `${frontmatter}
    You are a Senior Manual QA Engineer. Explain this topic: "${safeTopic}".
    - Focus: Exploratory testing, Edge cases, Test Design techniques (Equivalence Partitioning, BVA), Quality Advocacy.
    - Speaking Blueprint: Clear, analytical language to a Product Owner.
    ### Interview Question: ${safeTopic}
    ### Expert Answer: [Focus on testing methodology, coverage, defect analysis]
    ### Speaking Blueprint: [The Hook, The Core Execution, The Punchline]`;
}

async function generateInterviewQuestion(metadataArg: string, keyNumber: number) {
  const parts = metadataArg.split("|");
  if (parts.length < 4) return false;

  const [rolesStr, catsStr, difficulty, topic] = parts.map(p => p.trim());
  const targetRoles = rolesStr.split(",").map(r => r.trim().replace(/\s+/g, '_'));
  const coreCategories = catsStr.split(",").map(c => c.trim());
  const actualQuestion = topic;

  const coreSlug = actualQuestion.toLowerCase().replace(/[^a-z0-9\s]+/g, "").trim().replace(/\s+/g, "-");
  const outputPath = path.join(process.cwd(), "content", "posts", `${coreSlug}.md`);

  if (fs.existsSync(outputPath)) {
    console.log(`🛑 Bỏ qua: ${coreSlug}.md đã tồn tại.`);
    process.exit(2);
  }

  const isAutomation = targetRoles.some(r => r.includes("Automation") || r.includes("Software"));
  const isAI = targetRoles.some(r => r.includes("AI"));
  
  const apiKey = getTargetApiKey(keyNumber);
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  /// const prompt = getPromptByStrategy(actualQuestion, isAutomation, isAI, JSON.stringify(targetRoles), JSON.stringify(coreCategories), difficulty);

  try {
    console.log(`🤖 Đang generate: "${actualQuestion.slice(0, 50)}..."`);
    const responseText = await generateWithRetry(model, prompt);
    const cleanMarkdown = responseText.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();

    if (!fs.existsSync(path.dirname(outputPath))) fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, cleanMarkdown, "utf-8");
    return true;
  } catch (error) {
    console.error(`❌ Lỗi generate topic [${actualQuestion.slice(0, 30)}]:`, error);
    return false;
  }
}

async function main() {
  const [,, keyArg, metadataArg] = process.argv;
  const success = await generateInterviewQuestion(metadataArg, parseInt(keyArg));
  process.exit(success ? 0 : 1);
}

main();