import type { FileStatus } from "@/types/fileStatus";
import { getSuperSupabase } from "@/util/supabase/getSuperSupabase.server";

export async function changeFileStatus(
  file_name: string,
  file_status: FileStatus,
  user_id: string
) {
  const supabase = getSuperSupabase();

  // Check if the file exists for the given user
  const { data: existingFile, error: fetchError } = await supabase
    .from("files")
    .select()
    .eq("file_id", file_name)
    .eq("user_id", user_id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    return { data: null, error: fetchError };
  }

  if (existingFile) {
    // Update existing file
    const { data, error } = await supabase
      .from("files")
      .update({ status: file_status })
      .eq("file_id", existingFile.file_id)
      .select();
    return { data, error };
  }
  // Insert new file
  const { data, error } = await supabase
    .from("files")
    .insert({
      file_id: file_name,
      status: file_status,
      user_id: user_id,
    })
    .select();
  return { data, error };
}
