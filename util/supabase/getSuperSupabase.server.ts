import type { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";

export function getSuperSupabase() {
  return createClient<Database>(
    process.env.PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_KEY ?? "",
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
