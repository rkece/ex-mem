import { NextRequest, NextResponse } from 'next/server';
import { processQuestion } from '@/lib/intelligence-engine';

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();
    if (!question || typeof question !== 'string') {
      return NextResponse.json({ success: false, error: 'Question is required' }, { status: 400 });
    }

    const result = await processQuestion(question);
    return NextResponse.json({
      success: true,
      question,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
