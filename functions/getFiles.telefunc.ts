import { getSuperSupabase } from "@/util/supabase/getSuperSupabase.server";

export async function getFiles() {
  const supabaseAdmin = getSuperSupabase();

  const users = await supabaseAdmin.from("profiles").select("*, organization(*)");
  const files = await supabaseAdmin.storage.from("patient-documents").list();
  const fileStatuses = await supabaseAdmin.from("files").select("*");

  if (users.error || files.error || fileStatuses.error) {
    console.error("Error fetching data", users.error, files.error, fileStatuses.error);
    return { error: "Error fetching data" };
  }

  const filesWithProfileAndStatus = files.data.map(file => {
    const userProfile = users.data.find(user => user.user_id === file.name);
    const fileStatus = fileStatuses.data.find(status => status.file_id === file.name);
    return {
      ...file,
      userProfile,
      status: fileStatus ? fileStatus.status : null,
    };
  });

  return filesWithProfileAndStatus;
}