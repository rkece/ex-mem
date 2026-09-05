import { NextResponse } from 'next/server';
import { getConflicts } from '@/lib/memory-store';

export async function GET() {
  try {
    const conflicts = await getConflicts();
    return NextResponse.json({ success: true, count: conflicts.length, conflicts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
