import { NextRequest, NextResponse } from 'next/server';
import { getSources, saveSource } from '@/lib/memory-store';

export async function GET() {
  try {
    const sources = await getSources();
    return NextResponse.json({ success: true, count: sources.length, sources });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Document name is required' }, { status: 400 });
    }
    const newDoc = {
      id: `src-${Date.now()}`,
      name: body.name,
      type: body.type || 'spec',
      project: body.project || 'Ex-Mem Core',
      date: new Date().toISOString().split('T')[0],
      processingStatus: 'completed' as const,
      memoriesExtracted: body.memoriesExtracted || {
        events: 1,
        decisions: 1,
        entities: 3,
        discussions: 1,
        requirements: 1,
        actions: 0,
      },
      rawContent: body.rawContent || '',
      author: body.author || 'Contributor',
    };
    const saved = await saveSource(newDoc);
    return NextResponse.json({ success: true, source: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
