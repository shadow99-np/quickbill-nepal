import { NextResponse } from 'next/server';
import { getUserByToken, updateAdminPassword } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || '';
    const user = getUserByToken(token);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { newPassword } = body;

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const success = updateAdminPassword(newPassword);
    if (!success) {
      return NextResponse.json({ error: 'Failed to update admin password' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Admin password updated successfully!',
    });
  } catch (err: any) {
    console.error('change-password error:', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
