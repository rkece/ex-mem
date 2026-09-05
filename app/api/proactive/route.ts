import { NextRequest, NextResponse } from 'next/server';
import { getCurrentContext } from '@/lib/memory-store';
import { getProactiveMemories } from '@/lib/intelligence-engine';

export async function GET() {
  try {
    const context = await getCurrentContext();
    const proactiveMemories = await getProactiveMemories(context);
    return NextResponse.json({
      success: true,
      context,
      topRecall: proactiveMemories[0] || null,
      candidates: proactiveMemories.slice(0, 5),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const customContext = await request.json();
    const proactiveMemories = await getProactiveMemories(customContext);
    return NextResponse.json({
      success: true,
      context: customContext,
      topRecall: proactiveMemories[0] || null,
      candidates: proactiveMemories.slice(0, 5),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
