import { NextResponse } from 'next/server';
import { getUserByEmailOrUsername, hashPassword, createSession } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email or Username and password are required.' },
        { status: 400 }
      );
    }

    const user = getUserByEmailOrUsername(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email/username or password.' },
        { status: 401 }
      );
    }

    const hashedPassword = hashPassword(password);
    if (user.passwordHash !== hashedPassword) {
      return NextResponse.json(
        { error: 'Invalid email/username or password.' },
        { status: 401 }
      );
    }

    const token = createSession(user.id);

    return NextResponse.json({
      success: true,
      token,
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
    console.error('Login error', err);
    return NextResponse.json({ error: 'Server error during login.' }, { status: 500 });
  }
}
