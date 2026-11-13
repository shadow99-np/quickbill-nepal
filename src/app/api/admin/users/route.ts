import { NextResponse } from 'next/server';
import { getUserByToken, toggleUserPro, getAdminStats } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || '';
    const user = getUserByToken(token);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin required' }, { status: 403 });
    }

    const stats = getAdminStats();
    return NextResponse.json({ success: true, users: stats.users });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || '';
    const user = getUserByToken(token);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin required' }, { status: 403 });
    }

    const { userId, isPro } = await request.json();
    if (!userId || isPro === undefined) {
      return NextResponse.json({ error: 'User ID and isPro boolean required' }, { status: 400 });
    }

    const updated = toggleUserPro(userId, isPro);
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        email: updated.email,
        isPro: updated.isPro,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
