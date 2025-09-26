import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

let client: ReturnType<typeof createBrowserClient<Database>>

export function getSupabaseBrowserClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return client
}