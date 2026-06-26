// lib/utils/cleaner.ts

const TOOL_MAP: Record<string, string> = {
  "playright": "Playwright",
  "playwright": "Playwright",
  "cyprus": "Cypress",
  "cypress": "Cypress",
  "postman": "Postman",
  "devtools": "DevTools",
  "browserdevtools": "DevTools",
  "browser devtools": "DevTools",
  // Thêm các lỗi typo thường gặp vào đây
};

export function normalizeTool(tool: string | null | undefined): string {
  if (!tool) return "Generic";
  
  const clean = tool.trim().toLowerCase();
  
  // Trả về giá trị chuẩn nếu tìm thấy trong MAP, ngược lại lấy giá trị gốc viết hoa chữ cái đầu
  return TOOL_MAP[clean] || (clean.charAt(0).toUpperCase() + clean.slice(1));
}