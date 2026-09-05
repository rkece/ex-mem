import { NextRequest, NextResponse } from 'next/server';
import { getMemories, saveMemory } from '@/lib/memory-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const project = searchParams.get('project') || undefined;
    const type = searchParams.get('type') || undefined;
    const person = searchParams.get('person') || undefined;
    const search = searchParams.get('search') || undefined;

    const memories = await getMemories({ project, type, person, search });
    return NextResponse.json({ success: true, count: memories.length, memories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.content) {
      return NextResponse.json({ success: false, error: 'Memory content is required' }, { status: 400 });
    }

    const created = await saveMemory(body);
    return NextResponse.json({ success: true, memory: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
