import { createClient } from "@supabase/supabase-js";

// Publishable browser key is intended for client-side use.
// Keep Row Level Security (RLS) enabled in Supabase.
export const SUPABASE_URL = "https://llgyovmbcqridzrayicu.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_gmwkKVngvfFRjSTKnN2D-A_HC-W8WNR";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
