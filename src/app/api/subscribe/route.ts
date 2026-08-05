import { NextResponse } from 'next/server';
import { saveSubscriber, getSubscribers } from '@/lib/subscribers';

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const normEmail = email.toLowerCase();
    const existing = await getSubscribers();
    if (existing.find((s) => s.email === normEmail)) {
      return NextResponse.json({ error: 'Already subscribed' }, { status: 409 });
    }

    await saveSubscriber({ email: normEmail, createdAt: new Date().toISOString() });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Subscribe API error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
