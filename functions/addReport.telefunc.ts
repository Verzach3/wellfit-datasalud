import { getSuperSupabase } from "@/util/supabase/getSuperSupabase.server";

export async function addReport(report: string, user_id: string, report_name: string) {
  const admin = getSuperSupabase();

  await admin.from("reports").upsert({
    user_id: user_id,
    report: report,
    report_name: report_name
  })
}