import { NextResponse } from 'next/server';
import { getUserByToken, toggleUserPro, getAdminStats, grantUserProByIdentifier } from '@/lib/db';

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

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || '';
    const admin = getUserByToken(token);

    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin required' }, { status: 403 });
    }

    const { identifier, durationMonths } = await request.json();
    if (!identifier || typeof identifier !== 'string') {
      return NextResponse.json({ error: 'Username or Email is required' }, { status: 400 });
    }

    const months = durationMonths !== undefined ? Number(durationMonths) : 12;
    const result = grantUserProByIdentifier(identifier, months);

    if (!result.success || !result.user) {
      return NextResponse.json({ error: result.error || 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Pro successfully activated for ${result.user.businessName} (${result.user.email})!`,
      user: {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username || result.user.email.split('@')[0],
        businessName: result.user.businessName,
        isPro: result.user.isPro,
        proExpiresAt: result.user.proExpiresAt,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
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
