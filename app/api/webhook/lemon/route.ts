// app/api/webhook/lemon/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Tạm thời vô hiệu hóa logic Telegram Bot để build Landing Page trước
  return NextResponse.json({ message: 'Webhook is under construction' }, { status: 200 });
}