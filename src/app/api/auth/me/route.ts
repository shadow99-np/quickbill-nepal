import { NextResponse } from 'next/server';
import { getUserByToken, updateUser, removeSession } from '@/lib/db';

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
        username: user.username || user.email.split('@')[0],
        businessName: user.businessName,
        pan: user.pan,
        phone: user.phone,
        address: user.address,
        logoUrl: user.logoUrl,
        payment: user.payment,
        clients: user.clients || [],
        defaultNotes: user.defaultNotes,
        defaultTerms: user.defaultTerms,
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

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || '';
    const user = getUserByToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { businessName, pan, phone, address, logoUrl, payment, clients, defaultNotes, defaultTerms, username } = body;

    const updated = updateUser(user.id, {
      ...(businessName !== undefined ? { businessName } : {}),
      ...(pan !== undefined ? { pan } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(address !== undefined ? { address } : {}),
      ...(logoUrl !== undefined ? { logoUrl } : {}),
      ...(payment !== undefined ? { payment } : {}),
      ...(clients !== undefined ? { clients } : {}),
      ...(defaultNotes !== undefined ? { defaultNotes } : {}),
      ...(defaultTerms !== undefined ? { defaultTerms } : {}),
      ...(username !== undefined ? { username } : {}),
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated?.id,
        email: updated?.email,
        username: updated?.username || updated?.email.split('@')[0],
        businessName: updated?.businessName,
        pan: updated?.pan,
        phone: updated?.phone,
        address: updated?.address,
        logoUrl: updated?.logoUrl,
        payment: updated?.payment,
        clients: updated?.clients || [],
        defaultNotes: updated?.defaultNotes,
        defaultTerms: updated?.defaultTerms,
        isPro: !!updated?.isPro,
        proExpiresAt: updated?.proExpiresAt,
        role: updated?.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
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
