import { NextResponse } from 'next/server';
import { resetToInitialData } from '@/lib/memory-store';

export async function POST() {
  try {
    await resetToInitialData();
    return NextResponse.json({ success: true, message: 'Database reset to initial dataset successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
