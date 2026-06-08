import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import matter from "gray-matter";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ Chưa cấu hình GEMINI_API_KEY");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const postsDirectory = path.join(process.cwd(), "content/posts");

function getRawPosts() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory)
    .filter(file => file.endsWith(".md"))
    .map(file => {
      const content = fs.readFileSync(path.join(postsDirectory, file), "utf-8");
      const { data, content: rawBody } = matter(content);
      return { fileName: file, metadata: data, body: rawBody };
    });
}

async function runAggregation() {
  const allFiles = getRawPosts();
  
  // Lọc bài đơn lẻ
  const singlePosts = allFiles.filter(p => p.metadata.question_type !== "Compilation");

  // Nhóm theo vai trò (target_role)
  const rolesGroup: { [key: string]: any[] } = {};
  singlePosts.forEach(post => {
    const role = post.metadata.target_role || "QA_Engineer";
    if (!rolesGroup[role]) rolesGroup[role] = [];
    rolesGroup[role].push(post);
  });

  console.log("📊 Đang rà soát kho dữ liệu bài viết lẻ để tính toán mốc chẵn...");

  for (const role of Object.keys(rolesGroup)) {
    const postsInRole = rolesGroup[role];
    const totalSingles = postsInRole.length;
    const targetMilestone = Math.floor(totalSingles / 10) * 10;

    if (targetMilestone < 10) {
      console.log(`ℹ️ Vị trí [${role}] mới tích lũy được ${totalSingles} bài lẻ, chưa đạt mốc tạo đề chẵn (Tối thiểu cần 10).`);
      continue;
    }

    for (let milestone = 10; milestone <= targetMilestone; milestone += 10) {
      const slugTitle = `top-${milestone}-interview-questions-and-answers-for-${role.toLowerCase().replace(/_/g, "-")}`;
      const outputFileName = `${slugTitle}.md`;
      const outputPath = path.join(postsDirectory, outputFileName);

      if (fs.existsSync(outputPath)) {
        console.log(`⏩ Mốc [Top ${milestone}] của vai trò [${role}] đã được đóng gói từ trước. Bỏ qua.`);
        continue;
      }

      console.log(`🔥 Đủ điều kiện! Đang kích hoạt AI tổng hợp cẩm nang trang riêng: [Top ${milestone}] cho [${role}]...`);

      const selectedPosts = postsInRole.slice(0, milestone);
      const rawMaterials = selectedPosts.map((p, idx) => `--- QUESTION ${idx + 1} ---\nTitle: ${p.metadata.title}\nContent:\n${p.body}`).join("\n\n");

      // Nâng cấp prompt: Bắt Gemini tự phân tích và tự điền Taxonomy cho bài gộp, không lấy vội của bài lẻ đầu tiên
      const prompt = `
        You are an expert Principal QA Engineer and a world-class SEO editor.
        I will give you a list of ${milestone} individual interview questions and answers for the role "${role}".
        Your task is to merge, polish, and synthesize them into a single, cohesive, massive compilation post titled "Top ${milestone} Interview Questions and Answers for ${role.replace(/_/g, " ")}".

        CRITICAL REQUIREMENT (TAXONOMY EVALUATION):
        Analyze the combined content of these questions and determine the single most appropriate value for:
        - "category": Must be one of ['Technical', 'Foundations', 'Analytical_Behavioral'].
        - "sub_category": Must be one of ['Automation', 'API', 'Database', 'Performance', 'Security', 'Manual', 'Methodology', 'Strategy', 'Behavioral'].
        - "tool_stack": If the majority uses a tool, specify it ('Playwright', 'SQL', etc.), otherwise use 'None'.

        CRITICAL OUTPUT FORMAT:
        The entire output MUST be in raw Markdown format and MUST start with the exact Frontmatter structure below. Do not wrap the response or frontmatter in code blocks like \`\`\`markdown.

        ---
        title: 'Top ${milestone} Interview Questions and Answers for ${role.replace(/_/g, " ")}'
        difficulty: 'Advanced'
        target_role: '${role}'
        category: '[Insert Evaluated Value]'
        sub_category: '[Insert Evaluated Value]'
        question_type: 'Compilation'
        core_testing_type: 'Functional'
        domain: 'E-commerce'
        platform: 'Web'
        tool_stack: '[Insert Evaluated Value]'
        tags: ['testing', 'interview-prep', '${role.toLowerCase().replace(/_/g, "-")}', 'compilation']
        ---

        ## Overview
        [Provide a high-quality professional introduction explaining what this mega guide covers and how it guarantees success for a ${role.replace(/_/g, " ")} role]

        ### Compilation Questions:
        [Present all the provided questions and answers below sequentially. Re-format them beautifully with headings like "### Q1: [Question text]" and "### Answer:". Keep all code snippets, technical steps, and explanations from the source materials fully intact, ensuring production-grade quality.]

        Here is the source data to compile:
        ${rawMaterials}
      `;

      try {
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        const cleanMarkdown = responseText.replace(/^```markdown\n/, "").replace(/\n```$/, "");

        fs.writeFileSync(outputPath, cleanMarkdown, "utf-8");
        console.log(`✅ Đã tạo tệp bộ đề số chẵn thành công: /content/posts/${outputFileName}`);
      } catch (error) {
        console.error(`❌ Lỗi gọi API khi đóng gói mốc Top ${milestone}:`, error);
      }
    }
  }
  console.log("🎉 TIẾN TRÌNH QUÉT VÀ ĐÓNG GÓI BỘ ĐỀ TỰ ĐỘNG ĐÃ HOÀN TẤT MỸ MÃN!");
}

runAggregation();