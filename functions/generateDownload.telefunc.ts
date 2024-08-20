import { getSuperSupabase } from "@/util/supabase/getSuperSupabase.server";

export async function generateDownload(fileName: string) {
  const admin = getSuperSupabase();
  const { data, error } = await admin.storage.from("patient-documents").createSignedUrl(fileName, 60);
  if (error) {
    console.error("Error downloading file", error);
    return { error: "Error downloading file" };
  }
  return data;
}