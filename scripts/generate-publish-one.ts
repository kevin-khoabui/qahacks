import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

function run(command: string, args: string[]) {
  console.log(`\n▶ Running: ${command} ${args.join(" ")}`);

  execFileSync(command, args, {
    stdio: "inherit",
    env: process.env,
  });
}

function removeFileIfExists(filePath: string) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Removed old file: ${filePath}`);
  }
}

function main() {
  const generatedPostPath = path.join(process.cwd(), "generated-post.json");
  const rawGeminiOutputPath = path.join(process.cwd(), "gemini-raw-output.txt");

  console.log("Starting QAHacks one-post generation flow...");

  // 1. Fetch pending topics from Google Sheet
  run("npm", ["run", "fetch:pending"]);

  // 2. Clean old generated files
  removeFileIfExists(generatedPostPath);
  removeFileIfExists(rawGeminiOutputPath);

  // 3. Generate one post from the first pending topic
  run("npm", ["run", "generate:one"]);

  if (!fs.existsSync(generatedPostPath)) {
    throw new Error("generated-post.json was not created.");
  }

  const generatedPost = JSON.parse(
    fs.readFileSync(generatedPostPath, "utf-8")
  );

  console.log("\nGenerated post:");
  console.log({
    title: generatedPost.title,
    slug: generatedPost.slug,
    target_role: generatedPost.target_role,
    category: generatedPost.category,
    tool_stack: generatedPost.tool_stack,
    question_type: generatedPost.question_type,
    sub_category: generatedPost.sub_category,
  });

  // 4. Import generated post into remote D1
  run("npm", ["run", "import:post"]);

  // 5. Update Google Sheet row from pending to generated
  run("npm", ["run", "update:sheet"]);

  console.log("\nDone. One post generated, imported to D1, and marked as generated in Google Sheet.");
}

main();