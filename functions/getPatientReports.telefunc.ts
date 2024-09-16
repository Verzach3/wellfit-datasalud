import { getSuperSupabase } from "@/util/supabase/getSuperSupabase.server";

export async function getPatientReports(user_id: string) {
  const admin = getSuperSupabase();
  const { data, error } = await admin.from("reports").select("*").eq("user_id", user_id);
  return { data, error };
}