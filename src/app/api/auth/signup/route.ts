import { NextResponse } from 'next/server';
import { getUserByEmail, createUser, hashPassword, createSession } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, businessName, pan, phone, address } = body;

    if (!email || !password || !businessName) {
      return NextResponse.json(
        { error: 'Email, password, and business name are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please log in.' },
        { status: 409 }
      );
    }

    const newUser = createUser({
      email: email.trim().toLowerCase(),
      passwordHash: hashPassword(password),
      businessName: businessName.trim(),
      pan: (pan || '').trim(),
      phone: (phone || '').trim(),
      address: (address || '').trim(),
      role: 'user',
    });

    const token = createSession(newUser.id);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        businessName: newUser.businessName,
        pan: newUser.pan,
        phone: newUser.phone,
        address: newUser.address,
        isPro: false,
        role: newUser.role,
      },
    });
  } catch (err: any) {
    console.error('Signup error', err);
    return NextResponse.json({ error: 'Server error during sign up.' }, { status: 500 });
  }
}
