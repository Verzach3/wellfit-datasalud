import { getSuperSupabase } from "@/util/supabase/getSuperSupabase.server";

export async function getFolderFiles(folderName: string) {
  const admin = getSuperSupabase();

  const files = await admin.storage.from("patient-documents").list(folderName);

  return files;
}