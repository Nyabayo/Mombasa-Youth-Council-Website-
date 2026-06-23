import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is required')
if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required')

export const adminDb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})
