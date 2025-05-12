import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export async function initSupabase() {
  const creds = {
    PUBLIC_SUPABASE_URL: "https://iiqrcxvorwuyapkpfory.supabase.co",
    SUPABASE_ANON_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcXJjeHZvcnd1eWFwa3Bmb3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NzU1OTcsImV4cCI6MjA2MjI1MTU5N30.mP7tqVDvnBBtj8dSDd4oToGMfRiK7k9NVFcndXBPE-E",
  };

  globalThis.supabase = createBrowserClient(
    creds.PUBLIC_SUPABASE_URL,
    creds.SUPABASE_ANON_KEY,
  );

  console.log("InitSupabase:Session", await supabase.auth.getSession());
}
