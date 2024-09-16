import { getSuperSupabase } from "@/util/supabase/getSuperSupabase.server";
import type { Report } from "@/types/report";

export async function updateReport(report: Report) {
  const { data, error } = await getSuperSupabase()
    .from("reports")
    .update(report)
    .eq("id", report.id);
  return { data, error };
}