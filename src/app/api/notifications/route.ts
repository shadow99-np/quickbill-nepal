import { NextResponse } from 'next/server';
import { getActiveNotifications } from '@/lib/db';

export async function GET() {
  try {
    const notifications = getActiveNotifications();
    return NextResponse.json({
      success: true,
      notifications,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
