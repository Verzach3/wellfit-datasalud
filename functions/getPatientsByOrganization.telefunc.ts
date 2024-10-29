import { getSuperSupabase } from "@/util/supabase/getSuperSupabase.server";

export async function getPatientsByOrganization() {
  const supabaseAdmin = getSuperSupabase();

  const { data: profiles, error } = await supabaseAdmin.from("profiles").select("organization");

  if (error) {
    console.error("Error fetching patients data by organization", error);
    return { error: "Error fetching patient statistics" };
  }

  const patientsByOrganization = profiles.reduce<Record<string, number>>((acc, patient) => {
    const org = patient.organization;
    if (org) {
      const orgKey = typeof org === 'number' ? org.toString() : org;
      acc[orgKey] = (acc[orgKey] || 0) + 1;
    }
    return acc;
  }, {});

  return { patientsByOrganization };
}
