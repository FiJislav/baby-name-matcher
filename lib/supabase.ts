// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Browser/client-side client (uses anon key, subject to RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side admin client (uses service role key, bypasses RLS)
// Only use in API routes — never import in client components
export function createAdminClient() {
  if (!supabaseServiceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set')
  return createClient(supabaseUrl, supabaseServiceKey)
}
