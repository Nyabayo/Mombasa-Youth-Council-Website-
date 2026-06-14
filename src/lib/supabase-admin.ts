import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Use service role key when available (bypasses RLS); falls back to anon key
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const adminDb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})
