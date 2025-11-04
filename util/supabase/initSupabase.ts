import { createBrowserClient } from "@supabase/ssr";

export async function initSupabase() {
  const creds = {
    PUBLIC_SUPABASE_URL: "https://djctoonetyuckmfvvhlf.supabase.co",
    SUPABASE_ANON_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqY3Rvb25ldHl1Y2ttZnZ2aGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NzAzMjEsImV4cCI6MjA3NzI0NjMyMX0.2YCuLLGzs-RoZdbkrCtrrTO24mioKWvg1URv0bWjFq0",
  };

  globalThis.supabase = createBrowserClient(
    creds.PUBLIC_SUPABASE_URL,
    creds.SUPABASE_ANON_KEY,
  );

  console.log("InitSupabase:Session", await supabase.auth.getSession());
}
