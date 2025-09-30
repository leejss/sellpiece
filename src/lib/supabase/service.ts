/**
 * Server-only Supabase client using the SERVICE ROLE key.
 *
 * Why:
 * - We need to call `auth.admin.createUser()` which requires elevated privileges.
 * - We also want to bypass RLS for protected writes (e.g., inserting into `public.admins`).
 *
 * IMPORTANT:
 * - Never expose the service role key to the client. This file must only be imported on the server.
 * - Keep the key in environment variables (Vercel/Node) and do not log it.
 */

import { env } from "@env/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
export function createServiceClient(): SupabaseClient {
  // Note: We intentionally do not set auth persist options since this runs server-side.
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
