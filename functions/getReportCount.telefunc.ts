import { getSuperSupabase } from "@/util/supabase/getSuperSupabase.server";

export async function getReportCount() {
  const supabase = getSuperSupabase();

  const { count, error } = await supabase
    .from("reports") // Usamos la tabla "reports" como muestra la imagen
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching report count", error);
    return { error: "Error fetching report count" };
  }

  return { count };
}
