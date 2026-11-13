import { NextResponse } from 'next/server';
import { getUserByToken, removeSession } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || '';

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const user = getUserByToken(token);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        businessName: user.businessName,
        pan: user.pan,
        phone: user.phone,
        address: user.address,
        logoUrl: user.logoUrl,
        isPro: !!user.isPro,
        proExpiresAt: user.proExpiresAt,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error('Auth verification error', err);
    return NextResponse.json({ user: null });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || '';
    if (token) {
      removeSession(token);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: true });
  }
}
