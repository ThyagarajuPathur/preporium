import { createClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "@/lib/supabase/env";

/**
 * Cookie-less Supabase client for public, user-agnostic reads (e.g. the problem
 * catalog). Safe to invoke inside `unstable_cache` / `'use cache'` scopes where
 * accessing request-bound sources like cookies is not allowed.
 */
export function createAnonSupabase() {
  const { url, anonKey } = getSupabaseEnv();
  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
