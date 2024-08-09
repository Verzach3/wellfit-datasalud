import { getSuperSupabase } from "@/util/supabase/getSuperSupabase.server";

export async function getFiles() {
  const supabaseAdmin = getSuperSupabase();

  const users = await supabaseAdmin.from("profiles").select("*");
  const files = await supabaseAdmin.storage.from("patient-documents").list();

  console.log("admin:getFiles:Users data", users.data, "Files data", files);

}