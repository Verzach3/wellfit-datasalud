import { getSuperSupabase } from "@/util/supabase/getSuperSupabase.server";

export async function getOrganizations() {
  const supabase = getSuperSupabase();

  // Realizamos la consulta a la tabla "organizations" para obtener los campos id y name
  const { data: organizations, error } = await supabase
    .from("organizations")
    .select("id, name");

  // Manejo de errores
  if (error) {
    console.error("Error al obtener organizaciones", error);
    return { error: "Error al obtener organizaciones" };
  }

  // Retornamos los datos de las organizaciones
  return organizations;
}
