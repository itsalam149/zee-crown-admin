import { createClient } from '@supabase/supabase-js';

// This client is used on the server-side for admin actions
// that need to bypass Row Level Security (RLS).
export const createAdminClient = () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
        throw new Error('Missing Supabase URL or Service Key environment variables.');
    }

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY,
        {
            auth: {
                // This is important: it ensures the client doesn't accidentally use
                // a user's session cookie. It will always use the service key.
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
};