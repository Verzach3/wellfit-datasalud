import { getSuperSupabase } from "@/util/supabase/getSuperSupabase.server";

export async function addReport(report: string, user_id: string) {
  const admin = getSuperSupabase();

  await admin.from("reports").upsert({
    user_id: user_id,
    report: report
  })
}