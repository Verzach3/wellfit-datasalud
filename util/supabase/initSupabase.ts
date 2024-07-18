import { createClient } from "@supabase/supabase-js";

export async function initSupabase() {
  const creds = {
    PUBLIC_SUPABASE_URL: "https://xulaswsegmeymlufkcid.supabase.co",
    SUPABASE_ANON_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bGFzd3NlZ21leW1sdWZrY2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA3MTUwMjgsImV4cCI6MjAzNjI5MTAyOH0.CVl9fjH3T4oYlUr4Fcu1giXyshCqCiiL0B2pRtaKtRs",
  };

  globalThis.supabase = createClient(
    creds.PUBLIC_SUPABASE_URL,
    creds.SUPABASE_ANON_KEY,
  );

  console.log("Session", await supabase.auth.getSession());

  // set cookies of the session
  document.cookie = `token=${(await supabase.auth.getSession()).data.session?.access_token ?? ""}; path=/`;
  console.log("InitSupabase: Client initialized.");
}
