import { NextResponse } from 'next/server';
import { getUserByEmail, hashPassword, createSession } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const hashedPassword = hashPassword(password);
    if (user.passwordHash !== hashedPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
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
        businessName: user.businessName,
        pan: user.pan,
        phone: user.phone,
        address: user.address,
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
