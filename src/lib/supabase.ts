import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase admin (service-role) client.
 *
 * Used only on the server (API routes / server-side libs) — NEVER expose
 * SUPABASE_SERVICE_ROLE_KEY to the browser.
 *
 * If the env vars are not configured, this returns null so callers can
 * gracefully fall back to file-based storage (useful for local dev).
 */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  if (!client) {
    client = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}
