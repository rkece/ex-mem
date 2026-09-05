import { NextRequest, NextResponse } from 'next/server';
import { getCurrentContext, updateCurrentContext } from '@/lib/memory-store';

export async function GET() {
  try {
    const context = await getCurrentContext();
    return NextResponse.json({ success: true, context });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const update = await request.json();
    const updated = await updateCurrentContext(update);
    return NextResponse.json({ success: true, context: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
