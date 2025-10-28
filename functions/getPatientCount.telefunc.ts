import { getSuperSupabase } from "@/util/supabase/getSuperSupabase.server";

export async function getPatientCount() {
  const supabase = getSuperSupabase();

  const { count, error } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching patient count", error);
    return { error: "Error fetching patient count" };
  }

  return { count };
}
