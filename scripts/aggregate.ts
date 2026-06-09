import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import matter from "gray-matter";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const postsDirectory = path.join(process.cwd(), "content/posts");

// CHỈ ĐỊNH ĐÍCH DANH ĐẶC VỤ KEY 25 CHẠY RIÊNG KHÔNG SỢ TRÙNG LẶP HẰNG GIỜ
const SINGLE_AGGREGATE_KEY = process.env.GEMINI_API_KEY_25 || process.env.GEMINI_API_KEY || "";

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
  console.log("🔑 [Gộp bài Daily] Khởi động cỗ máy bằng API Key số 25 biệt phái.");
  if (!SINGLE_AGGREGATE_KEY) {
    console.error("❌ Lỗi: Không tìm thấy cấu hình GEMINI_API_KEY_25!");
    return;
  }

  const allFiles = getRawPosts();
  const singlePosts = allFiles.filter(p => p.metadata.question_type !== "Compilation");
  const compilationPosts = allFiles.filter(p => p.metadata.question_type === "Compilation");

  const rolesGroup: { [key: string]: any[] } = {};
  singlePosts.forEach(post => {
    const role = post.metadata.target_role || "QA_Engineer";
    if (!rolesGroup[role]) rolesGroup[role] = [];
    rolesGroup[role].push(post);
  });

  // Quét đếm chuẩn các mốc chẵn yêu cầu (Tối đa mốc 50)
  const targetMilestones = [10, 20, 30, 40, 50];

  for (const [role, posts] of Object.entries(rolesGroup)) {
    const totalSinglePosts = posts.length;

    for (const milestone of targetMilestones) {
      if (totalSinglePosts >= milestone) {
        const outputFileName = `top-${milestone}-${role.toLowerCase().replace(/_/g, "-")}.md`;
        const outputPath = path.join(postsDirectory, outputFileName);

        // KIỂM TRA: Tập này tạo rồi thì bỏ qua luôn
        const alreadyExists = compilationPosts.some(cp => cp.fileName === outputFileName);
        if (alreadyExists) {
          console.log(`⏭️ Bộ đề Top ${milestone} cho [${role}] đã tồn tại. Bỏ qua.`);
          continue;
        }

        const genAI = new GoogleGenerativeAI(SINGLE_AGGREGATE_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

        const postsToCompile = posts.slice(0, milestone);
        const rawMaterials = postsToCompile.map((p, idx) => `--- Bài lẻ ${idx + 1} ---\nTiêu đề: ${p.metadata.title}\nNội dung:\n${p.body}`).join("\n\n");

        console.log(`🤖 [Gộp bài số chẵn] Tiến hành đóng gói bộ đề Top ${milestone} cho vai trò: [${role}]...`);

        const prompt = `
          You are an expert Principal QA Consultant. Write a high-quality professional compilation guide post titled: "Top ${milestone} ${role.replace(/_/g, " ")} Interview Questions & Strategic Answers Blueprint".
          
          The output MUST start with this Frontmatter:
          ---
          title: 'Top ${milestone} ${role.replace(/_/g, " ")} Interview Questions & Strategic Answers Blueprint'
          difficulty: 'Advanced'
          target_role: '${role}'
          category: 'Technical'
          sub_category: 'Strategy'
          question_type: 'Compilation'
          core_testing_type: 'Functional'
          domain: 'E-commerce'
          platform: 'Web'
          tool_stack: 'None'
          tags: ['testing', 'interview-prep', '${role.toLowerCase().replace(/_/g, "-")}', 'compilation', 'top-${milestone}']
          ---

          ## Overview
          Provide a high-quality professional introduction explaining what this mega guide covers and how it guarantees success for a ${role.replace(/_/g, " ")} role.

          ### Compilation Questions:
          Present all the provided questions and answers below sequentially. Re-format them beautifully with headings like "### Q[Number]: [Question text]" and "### Expert Answer:". Keep all code snippets, technical steps, and explanations from the source materials fully intact, ensuring production-grade quality.

          Here is the source data to compile:
          ${rawMaterials}
        `;

        try {
          const result = await model.generateContent(prompt);
          let responseText = result.response.text();
          const cleanMarkdown = responseText.replace(/^```markdown\n/, "").replace(/\n```$/, "");

          fs.writeFileSync(outputPath, cleanMarkdown, "utf-8");
          console.log(`🔥 [XUẤT BẢN THÀNH CÔNG] Đã tạo file Compilation: /content/posts/${outputFileName}`);
        } catch (error) {
          console.error(`❌ Lỗi gọi API khi đóng gói mốc Top ${milestone}:`, error);
        }
      }
    }
  }
  console.log("🎉 TIẾN TRÌNH QUÉT ĐẾM MỐC CHẴN ĐÃ HOÀN TẤT AN TOÀN.");
}

runAggregation();