import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, isHuman } = body;

    if (!firstName || !lastName || !email || !isHuman) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

const record = {
      first_name: String(firstName).trim(),
      last_name: String(lastName).trim(),
      email: String(email).toLowerCase().trim(),
      phone: phone ? String(phone).trim() : '',
    };

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin()!;
      const { error } = await supabase.from('dnsmpi_requests').insert(record);

      if (error) {
        throw new Error(error.message);
      }
    } else {
      // Fallback: persist to a local JSON file for audit/tracking when no DB is configured.
      const { promises: fs } = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'data', 'dnsmpi.json');

      let requests: unknown[] = [];
      try {
        const raw = await fs.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          requests = parsed;
        }
      } catch {
        // File not present yet — start fresh.
      }

      requests.push({
        ...record,
        createdAt: new Date().toISOString(),
      });

      await fs.writeFile(filePath, JSON.stringify(requests, null, 2), 'utf-8');
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('DNSMPI API error:', error);
    return NextResponse.json(
      { error: 'Failed to submit your request. Please try again.' },
      { status: 500 }
    );
  }
}
