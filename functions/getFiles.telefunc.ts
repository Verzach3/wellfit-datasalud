import { getSuperSupabase } from "@/util/supabase/getSuperSupabase.server";

export async function getFiles() {
  const supabaseAdmin = getSuperSupabase();

  const users = await supabaseAdmin.from("profiles").select("*");
  const files = await supabaseAdmin.storage.from("patient-documents").list();

  if (users.error || files.error) {
    console.error("Error fetching data", users.error, files.error);
    return { error: "Error fetching data" };
  }

  const filesWithProfile = files.data.map(file => {
    const userProfile = users.data.find(user => user.user_id === file.name);
    return {
      ...file,
      userProfile
    };
  });

  console.log("admin:getFiles", filesWithProfile);

  return filesWithProfile;
}