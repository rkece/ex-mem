import { NextRequest, NextResponse } from 'next/server';
import { getReconstructionGraph } from '@/lib/intelligence-engine';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memoryId = searchParams.get('memoryId') || 'mem-103';

    const graph = getReconstructionGraph(memoryId);
    return NextResponse.json({ success: true, graph });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
