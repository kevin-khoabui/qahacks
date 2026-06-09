import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import matter from "gray-matter";

// 1. Nạp cấu hình bảo mật .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const postsDirectory = path.join(process.cwd(), "content/posts");

async function combineExistingPostsToCollection(topicLine: string): Promise<boolean> {
  const milestoneMatch = topicLine.match(/\b(10|20|30|40|50)\b/);
  const totalNeeded = milestoneMatch ? parseInt(milestoneMatch[1], 10) : 10;

  // Nhận diện target_role thông minh từ tiêu đề
  let rawRole = "QA Engineer";
  const roleMatchWithFor = topicLine.match(/for\s+(.+)$/i);
  
  if (roleMatchWithFor) {
    rawRole = roleMatchWithFor[1].trim();
  } else {
    const roleMatchBetween = topicLine.match(/Top\s+\d+\s+(.+?)\s+Interview/i);
    if (roleMatchBetween) {
      rawRole = roleMatchBetween[1].replace(/&/g, "").replace(/\s+/g, " ").trim();
    }
  }

  const targetRoleSlug = rawRole.replace(/\s+/g, "_");

  console.log(`\n🔍 [Vá Lỗi Giao Diện] Tiến hành gộp bài cho chủ đề: "${topicLine}"`);
  console.log(`🎯 Mục tiêu: Gom đúng các bài lẻ có target_role là [${targetRoleSlug}]`);

  if (!fs.existsSync(postsDirectory)) {
    console.error("❌ Lỗi: Không tìm thấy thư mục content/posts!");
    return false;
  }

  const allFiles = fs.readdirSync(postsDirectory).filter(file => file.endsWith(".md"));
  const poolOfValidContent: string[] = [];

  for (const file of allFiles) {
    const fullPath = path.join(postsDirectory, file);
    const fileContents = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(fileContents);

    // Lọc đạn chuẩn xác từ kho bài lẻ
    if (data.target_role === targetRoleSlug && data.question_type !== "Compilation") {
      // Xóa sạch các tiêu đề H1 trùng lặp bám trong nội dung bài lẻ nếu có
      const cleanContent = content.replace(/^#\s+.*$/m, "").trim();
      poolOfValidContent.push(cleanContent);
    }
  }

  console.log(`📦 Kho đạn: Nhặt được ${poolOfValidContent.length} bài lẻ tương thích.`);

  const finalPostsToCombine = poolOfValidContent.slice(0, totalNeeded);
  const actualCount = finalPostsToCombine.length;

  if (actualCount === 0) {
    console.error(`❌ THẤT BẠI: Không có bài lẻ nào mang target_role: "${targetRoleSlug}" để gộp!`);
    return false;
  }

  // LẮP GHÉP CƠ KHÍ & ÉP SỐ THỨ TỰ ĐỘNG
  let masterContentBody = "";
  
  finalPostsToCombine.forEach((rawPostContent, index) => {
    const qNum = index + 1;
    
    // Ép con số vòng lặp vào sau chữ Question/Answer để bẻ gãy ID trùng lặp
    let processedContent = rawPostContent
      .replace(/###\s+Interview\s+Question:/i, `### Interview Question ${qNum}:`)
      .replace(/###\s+Expert\s+Answer:/i, `### Expert Answer ${qNum}:`)
      .replace(/###\s+Speaking\s+Blueprint\s*\(3-Minute\s+Verbal\s+Response\):/i, `### Speaking Blueprint ${qNum} (3-Minute Verbal Response):`);

    masterContentBody += `\n## Question ${qNum}\n${processedContent}\n\n---\n`;
  });

  // ĐÃ SỬA: Xóa bỏ thẻ h1 rác trùng lặp ở đây, chỉ để Overview và Body
  const finalFileContent = `---
title: '${topicLine}'
difficulty: 'Advanced'
target_role: '${targetRoleSlug}'
category: 'Technical'
sub_category: 'Strategy'
question_type: 'Compilation'
core_testing_type: 'Functional'
domain: 'E-commerce'
platform: 'Web'
tool_stack: 'None'
tags: ['testing', 'interview-prep', '${rawRole.toLowerCase().replace(/[^a-z0-9]+/g, "-")}', 'compilation', 'top-${actualCount}']
---

## Overview
This master compilation guide aggregates elite, high-probability interview questions and battle-tested solutions tailored specifically for ${rawRole} candidates.

## Purpose
The purpose of this guide is to provide candidates with fully articulated speaking blueprints to confidently navigate high-stakes technical evaluation panels.

## Compilation Questions
${masterContentBody}
`;

  try {
    const fileName = `${topicLine.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
    const outputPath = path.join(postsDirectory, fileName);
    
    fs.writeFileSync(outputPath, finalFileContent, "utf-8");
    console.log(`✅ [SUCCESS] Xử lý rác thành công! File mới đã ghi đè tại: /content/posts/${fileName}`);
    return true;
  } catch (error) {
    console.error("❌ Lỗi ghi file gộp bài:", error);
    return false;
  }
}

async function main() {
  const filePath = path.join(process.cwd(), "topics_top.txt");
  const doneFilePath = path.join(process.cwd(), "done_topics_top.txt");

  if (!fs.existsSync(filePath)) {
    console.error("❌ Không tìm thấy file topics_top.txt!");
    process.exit(1);
  }

  const lines = fs.readFileSync(filePath, "utf-8").split("\n").map(line => line.trim());
  const validTopics = lines.filter(line => line.length > 0);

  if (validTopics.length === 0) {
    console.log("🎉 File topics_top.txt hiện tại đang trống.");
    return;
  }

  const currentTopic = validTopics[0];
  const success = await combineExistingPostsToCollection(currentTopic);

  if (success) {
    fs.appendFileSync(doneFilePath, `${currentTopic}\n`, "utf-8");
    const targetIndex = lines.findIndex(l => l.trim() === currentTopic);
    if (targetIndex !== -1) lines.splice(targetIndex, 1);
    fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
    console.log(`✂️ Kho topics_top.txt còn lại: ${validTopics.length - 1} chủ đề.`);
  }
}

main();