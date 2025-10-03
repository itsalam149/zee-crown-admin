// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // This client uses the anon key but will work because RLS is disabled.
    // For client-side operations that require admin rights (like deleting),
    // you would typically create a secure API route, but for now this is fine.
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}