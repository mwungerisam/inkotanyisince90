import { promises as fs } from 'fs';
import path from 'path';
import { getSupabaseAdmin, isSupabaseConfigured } from './supabase';

export type Subscriber = {
  email: string;
  createdAt: string;
};

const subscribersFilePath = path.join(process.cwd(), 'data', 'subscribers.json');

async function readSubscribersFile(): Promise<Subscriber[]> {
  try {
    const raw = await fs.readFile(subscribersFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await fs.writeFile(subscribersFilePath, '[]', 'utf-8');
      return [];
    }
    console.error('Error reading subscribers file:', error);
    return [];
  }
}

async function writeSubscribersFile(subs: Subscriber[]) {
  await fs.writeFile(subscribersFilePath, JSON.stringify(subs, null, 2), 'utf-8');
}

export async function getSubscribers(): Promise<Subscriber[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin()!;
    const { data, error } = await supabase
      .from('subscribers')
      .select('email, created_at');

    if (error) {
      console.error('Supabase getSubscribers failed:', error.message);
      throw new Error(`Failed to load subscribers: ${error.message}`);
    }

    return (data ?? []).map((row: any) => ({
      email: row.email,
      createdAt: new Date(row.created_at).toISOString(),
    }));
  }

  return readSubscribersFile();
}

export async function saveSubscriber(subscriber: Subscriber): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin()!;
    const { error } = await supabase
      .from('subscribers')
      .insert({ email: subscriber.email });

    if (error) {
      console.error('Supabase saveSubscriber failed:', error.message);
      throw new Error(`Failed to save subscriber: ${error.message}`);
    }
    return;
  }

  const subs = await readSubscribersFile();
  subs.push(subscriber);
  await writeSubscribersFile(subs);
}
