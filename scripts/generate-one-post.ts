import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: ".env.local" });

type PendingTopic = {
  rowNumber: number;
  id: string;
  topic: string;
  roles: string;
  categories: string;
  difficulty: string;
  tool_stack: string;
  question_type: string;
  sub_category: string;
  status: string;
  slug: string;
  generated_at: string;
  error_message: string;
  interview_source: string;
};

type GeneratedPost = {
  source_row_number: number;
  source_id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  difficulty: string;
  category: string[];
  target_role: string[];
  sub_category: string | null;
  question_type: string | null;
  tool_stack: string | null;
  tags: string[];
  date: string;
  interview_source: string | null;
};

const GEMINI_API_KEYS = process.env.GEMINI_API_KEYS;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

if (!GEMINI_API_KEYS) {
  throw new Error("Missing GEMINI_API_KEYS in .env.local");
}

const apiKeys = GEMINI_API_KEYS.split(",")
  .map((key) => key.trim())
  .filter(Boolean);

if (apiKeys.length === 0) {
  throw new Error("No valid Gemini API key found.");
}

function cleanText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function optionalMetadataText(value: unknown): string | null {
  const cleaned = cleanText(value);

  if (!cleaned) return null;

  const placeholderValues = new Set([
    "generic",
    "general",
    "scenario",
    "not specified",
    "none",
    "n/a",
    "na",
    "null",
    "-",
  ]);

  if (placeholderValues.has(cleaned.toLowerCase())) {
    return null;
  }

  return cleaned;
}

function splitToArray(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function normalizeQuestionTitle(input: string): string {
  const cleaned = cleanText(input)
    .replace(/\s+/g, " ")
    .replace(/^["']|["']$/g, "")
    .trim();

  if (!cleaned) {
    throw new Error("Cannot create title from empty topic.");
  }

  return cleaned.endsWith("?") ? cleaned : `${cleaned}?`;
}

function extractJson(text: string) {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error("Gemini response is not valid JSON.");
    }

    const jsonOnly = cleaned.slice(firstBrace, lastBrace + 1);
    return JSON.parse(jsonOnly);
  }
}

function validateRequiredTopicFields(topic: PendingTopic) {
  const missingFields: string[] = [];

  if (!cleanText(topic.topic)) missingFields.push("topic");
  if (!cleanText(topic.roles)) missingFields.push("roles");
  if (!cleanText(topic.categories)) missingFields.push("categories");
  if (!cleanText(topic.difficulty)) missingFields.push("difficulty");
  if (!cleanText(topic.status)) missingFields.push("status");

  if (missingFields.length > 0) {
    throw new Error(
      `Missing required field(s) in Google Sheet row ${
        topic.rowNumber
      }: ${missingFields.join(", ")}`
    );
  }
}

function buildPrompt(topic: PendingTopic) {
  const seoTitle = normalizeQuestionTitle(topic.topic);

  const toolStack = optionalMetadataText(topic.tool_stack) || "Not specified";
  const questionType =
    optionalMetadataText(topic.question_type) || "Not specified";
  const subCategory =
    optionalMetadataText(topic.sub_category) || "Not specified";

  const source = optionalMetadataText(topic.interview_source) || "General";

  return `
You are a senior technical interview coach, engineering manager, and technical content writer.
Interview Style Persona: ${source}

Generate one high-quality QAHacks interview article for this topic.

Important Persona Rule:
- If Interview Style Persona is 'FAANG_DSA': Focus heavily on algorithmic optimality, Big O analysis, and clean, production-grade code.
- If Interview Style Persona is 'Amazon_Microsoft': Focus on system reliability, practical engineering decisions, trade-offs, and customer obsession.
- If Interview Style Persona is 'General': Focus on practical, real-world execution.

SEO title:
${seoTitle}

Topic:
${topic.topic}

Metadata:
- Target role: ${topic.roles}
- Category: ${topic.categories}
- Difficulty: ${topic.difficulty}
- Tool stack: ${toolStack}
- Question type: ${questionType}
- Sub category: ${subCategory}

Critical title rule:
The "title" field must be exactly this question:
${seoTitle}

Do not create a creative title.
Do not add phrases like "A QA Engineer's Playbook", "Navigating Ambiguity", "Guide", "Best Practices", or "Ultimate Answer".
The title must be short, natural, and written as a question.
The title must match the interview question topic.

Important role-aware writing rule:
Adapt the article to the target role.

If the target role is a QA role, focus on:
- testing strategy
- risk analysis
- bug investigation
- test coverage
- release quality
- stakeholder communication
- manual testing or automation when relevant

If the target role is Software_Engineer, focus on:
- software design
- code quality
- debugging
- architecture
- scalability
- maintainability
- production incidents
- collaboration with product, QA, DevOps, and other engineers
- trade-offs in engineering decisions

Do not force QA language into Software Engineer articles.
Do not force Software Engineer language into QA articles.
Use the target role metadata to decide the correct angle.

Output requirements:
Return ONLY valid JSON.
Do not wrap in markdown.
Do not include explanations outside JSON.
All newline characters inside JSON string values must be escaped correctly.
All double quotes inside string values must be escaped correctly.
The response must be directly parseable by JSON.parse().

Important JSON safety rule:
Do NOT use double quotation marks inside the title, excerpt, content, or tags values.
Do NOT wrap speaking lines in quotes.
Do NOT write dialogue using quotation marks.
Use plain sentences instead.

JSON schema:
{
  "title": "string",
  "excerpt": "string",
  "content": "markdown string",
  "tags": ["string", "string", "string"]
}

Very important content format:
The "content" field must contain EXACTLY these 6 markdown sections only:

## Overview

### Interview Question:

### Why Interviewers Ask This:

### Expert Answer:

### Speaking Blueprint:

### Common Mistakes:

Do NOT include these sections:
- Step-by-Step Approach
- Example Speaking Answer
- Follow-up Questions
- Final Takeaway
- Conclusion
- FAQ
- Additional Tips

Content rules:
- Write in English.
- Do not include frontmatter.
- Do not repeat the article title inside content except inside the Interview Question section.
- Use only one H2 heading: ## Overview.
- Use H3 headings for the other sections.
- Keep the content practical and interview-focused.
- Avoid generic textbook theory.
- Total content should be around 900-1200 words.
- Use markdown **bold** for important keywords.
- Do not use HTML.

Avoid AI-style introductions:
Do not start with phrases like:
- "In today's fast-paced world..."
- "In the ever-evolving landscape..."
- "In modern software development..."
- "In the fast-paced world of software development..."

Start directly with the practical problem.

Section details:

## Overview
Write 1 short paragraph explaining the real interview situation and why this question matters.
Start directly and practically.
Do not use generic AI-style intro phrases.

### Interview Question:
Repeat the exact interview question naturally:
${seoTitle}

### Why Interviewers Ask This:
Explain what the interviewer wants to evaluate.
Focus on judgment, ownership, communication, problem-solving, prioritization, risk awareness, and practical engineering thinking.
Write 1-2 paragraphs.

### Expert Answer:
Write a strong practical answer with clear structure.
Use 3-5 paragraphs.
Make the answer easy to follow by using transition phrases such as:
- First
- Next
- Then
- Finally

Focus on real-world execution for the target role.
Include concrete actions, trade-offs, collaboration, risk management, communication, and measurable outcomes when relevant.
Make this section useful for candidates preparing for real interviews.

Security rule:
Mention security only when it is directly relevant to the topic.
Do not turn the answer into a security testing or cybersecurity article unless the topic requires it.

### Speaking Blueprint:
Create a 3-minute verbal response that the candidate can speak in an interview.
Use exactly these 3 labeled parts:

[The Hook]

[The Core Execution]

[The Punchline]

Each part should be natural, confident, and easy to speak.
Do not make it sound robotic.
Do not make it too long.

Do not wrap [The Hook], [The Core Execution], or [The Punchline] answers in quotation marks.
Write the speaking answer as plain text only.

### Common Mistakes:
List 4-6 common mistakes candidates should avoid.
Use markdown bullet points.
Each bullet must use this format:
- **Mistake name:** Practical explanation.

Tone:
- Clear
- Practical
- Senior-level
- Interview-ready
- Easy to read
- Useful for SEO
`;
}

async function generateWithGemini(topic: PendingTopic) {
  let lastError: unknown = null;

  for (const apiKey of apiKeys) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);

      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        generationConfig: {
          temperature: 0.4,
          topP: 0.8,
          maxOutputTokens: 8192,

          // Important: force Gemini to return JSON instead of loose text.
          responseMimeType: "application/json",
        } as any,
      });

      const result = await model.generateContent(buildPrompt(topic));
      const text = result.response.text();

      try {
        return extractJson(text);
      } catch (parseError) {
        const debugPath = path.join(process.cwd(), "gemini-raw-output.txt");
        fs.writeFileSync(debugPath, text, "utf-8");

        console.error("Gemini returned invalid JSON.");
        console.error(`Raw output saved to ${debugPath}`);

        throw parseError;
      }
    } catch (error) {
      lastError = error;
      console.error("Gemini generation failed. Trying next key if available...");
    }
  }

  throw lastError || new Error("Gemini generation failed.");
}

function validateGeneratedPost(generated: any, topic: PendingTopic) {
  if (!generated || typeof generated !== "object") {
    throw new Error("Generated response is not an object.");
  }

  if (!cleanText(generated.title)) {
    throw new Error("Generated post is missing title.");
  }

  const expectedTitle = normalizeQuestionTitle(topic.topic);
  const actualTitle = cleanText(generated.title);

  if (actualTitle !== expectedTitle) {
    throw new Error(
      `Generated title does not match SEO title. Expected "${expectedTitle}", got "${actualTitle}".`
    );
  }

  if (!cleanText(generated.excerpt)) {
    throw new Error("Generated post is missing excerpt.");
  }

  if (!cleanText(generated.content)) {
    throw new Error("Generated post is missing content.");
  }

  const requiredSections = [
    "## Overview",
    "### Interview Question:",
    "### Why Interviewers Ask This:",
    "### Expert Answer:",
    "### Speaking Blueprint:",
    "### Common Mistakes:",
  ];

  const missingSections = requiredSections.filter(
    (section) => !generated.content.includes(section)
  );

  if (missingSections.length > 0) {
    throw new Error(
      `Generated content is missing required section(s): ${missingSections.join(
        ", "
      )}`
    );
  }
}

async function main() {
  const topicsPath = path.join(process.cwd(), "topics.json");

  if (!fs.existsSync(topicsPath)) {
    throw new Error("topics.json not found. Run npm run fetch:pending first.");
  }

  const topics = JSON.parse(
    fs.readFileSync(topicsPath, "utf-8")
  ) as PendingTopic[];

  if (!Array.isArray(topics) || topics.length === 0) {
    console.log("No pending topic found in topics.json.");
    return;
  }

  const topic = topics[0];

  validateRequiredTopicFields(topic);

  console.log("Generating post for first pending topic:");
  console.log(topic.topic);

  const generated = await generateWithGemini(topic);

  validateGeneratedPost(generated, topic);

  // SEO rule:
  // Title must be a question.
  // Slug must be generated from the exact title, so title and slug stay aligned.
  const title = normalizeQuestionTitle(topic.topic);
  const slug = cleanText(topic.slug) || slugify(title);

  const post: GeneratedPost = {
    source_row_number: topic.rowNumber,
    source_id: cleanText(topic.id),
    slug,
    title,
    excerpt: cleanText(generated.excerpt),
    content: cleanText(generated.content),

    // Required metadata from Google Sheet.
    // If these are missing, the script fails instead of saving fake/default values.
    difficulty: cleanText(topic.difficulty),
    category: splitToArray(topic.categories),
    target_role: splitToArray(topic.roles),

    // Optional metadata.
    // Empty/placeholder values become null, not fake values like Generic/Scenario/General.
    sub_category: optionalMetadataText(topic.sub_category),
    question_type: optionalMetadataText(topic.question_type),
    tool_stack: optionalMetadataText(topic.tool_stack),
    interview_source: optionalMetadataText(topic.interview_source),

    tags: Array.isArray(generated.tags)
      ? generated.tags.map((tag: unknown) => cleanText(tag)).filter(Boolean)
      : [],

    date: new Date().toISOString(),
  };

  const outputPath = path.join(process.cwd(), "generated-post.json");

  fs.writeFileSync(outputPath, JSON.stringify(post, null, 2), "utf-8");

  console.log("Generated successfully.");
  console.log(`Saved to ${outputPath}`);
  console.log({
    slug: post.slug,
    title: post.title,
    source_row_number: post.source_row_number,
    target_role: post.target_role,
    category: post.category,
    tool_stack: post.tool_stack,
    question_type: post.question_type,
    sub_category: post.sub_category,
  });
}

main().catch((error) => {
  console.error("Failed to generate post:");
  console.error(error);
  process.exit(1);
});