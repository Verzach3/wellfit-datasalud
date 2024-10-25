import { getSuperSupabase } from "@/util/supabase/getSuperSupabase.server";

export async function getAllProfiles() {
  const supabase = getSuperSupabase();

  const { data: profiles, error } = await supabase.from("profiles").select("*");

  if (error) {
    console.error("Error fetching data", error);
    return { error: "Error fetching data" };
  }

  return profiles;
}
