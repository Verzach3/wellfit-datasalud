// functions/getFilesByUserId.telefunc.js
import { getSuperSupabase } from "@/util/supabase/getSuperSupabase.server";

export async function getFilesByUserId(userId: string) {
    try {
      const supabaseAdmin = getSuperSupabase();
  
      const userProfileRes = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();
  
      const filesRes = await supabaseAdmin.storage
        .from("patient-documents")
        .list(`user_${userId}`);
  
      if (userProfileRes.error || filesRes.error) {
        console.error("Error fetching user data or files", userProfileRes.error, filesRes.error);
        return { error: "Error fetching data" };
      }
  
      return {
        userProfile: userProfileRes.data,
        files: filesRes.data ?? [], // Asegúrate de devolver un array vacío si no hay archivos
      };
    } catch (error) {
      console.error("Unexpected error fetching files by user ID", error);
      return { error: "Unexpected error fetching files" };
    }
  }