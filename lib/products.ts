// lib/products.ts
export interface Product {
  id: string; 
  name: string;
  price: string;
  category: "Manual" | "Automation" | "AI";
  level: "Junior" | "Senior" | "Leader";
  scenarios: 50;
  telegramChannelId: string;
}

export const PRODUCTS: { [key: string]: Product } = {
  // MANUAL
  'manual-junior-50': { id: 'm_j_50', name: '50 Junior Manual QA Interview Questions & Answers', price: '$49', category: 'Manual', level: 'Junior', scenarios: 50, telegramChannelId: '' },
  'manual-senior-50': { id: 'm_s_50', name: '50 Senior Manual QA Interview Questions & Answers', price: '$49', category: 'Manual', level: 'Senior', scenarios: 50, telegramChannelId: '' },
  'manual-leader-50': { id: 'm_l_50', name: '50 Manual QA Leader Interview Questions & Answers', price: '$49', category: 'Manual', level: 'Leader', scenarios: 50, telegramChannelId: '' },
  
  // AUTOMATION
  'auto-junior-50': { id: 'a_j_50', name: '50 Junior Automation QA Interview Questions & Answers', price: '$49', category: 'Automation', level: 'Junior', scenarios: 50, telegramChannelId: '' },
  'auto-senior-50': { id: 'a_s_50', name: '50 Senior Automation QA Interview Questions & Answers', price: '$49', category: 'Automation', level: 'Senior', scenarios: 50, telegramChannelId: '' },
  'auto-leader-50': { id: 'a_l_50', name: '50 Automation QA Leader Interview Questions & Answers', price: '$49', category: 'Automation', level: 'Leader', scenarios: 50, telegramChannelId: '' },
  
  // AI ENGINEERING
  'ai-junior-50': { id: 'ai_j_50', name: '50 Junior AI Software Engineer Interview Questions & Answers', price: '$49', category: 'AI', level: 'Junior', scenarios: 50, telegramChannelId: '' },
  'ai-senior-50': { id: 'ai_s_50', name: '50 Senior AI Software Engineer Interview Questions & Answers', price: '$49', category: 'AI', level: 'Senior', scenarios: 50, telegramChannelId: '' }
};