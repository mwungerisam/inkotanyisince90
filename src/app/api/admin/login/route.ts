import { NextRequest, NextResponse } from 'next/server';

// Read the admin password from a server-side env var only. Never expose it to
// the client bundle. If unset in production, admin login is disabled.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Admin access is not configured on the server.' },
        { status: 503 }
      );
    }

    // Constant-time-ish comparison to avoid trivial timing leaks.
    const a = Buffer.from(password);
    const b = Buffer.from(ADMIN_PASSWORD);
    const ok =
      a.length === b.length &&
      a.reduce((acc, byte, i) => acc | (byte ^ b[i]), 0) === 0;

    if (!ok) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
