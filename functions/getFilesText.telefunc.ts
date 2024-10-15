import { getOpenAI } from "@/util/getOpenai";
import { getSuperSupabase } from "@/util/supabase/getSuperSupabase.server";
import type { FileObject } from "@supabase/storage-js";
import { extractText } from "unpdf";
export async function getFilesText(folderName: string, files: FileObject[]) {
  console.time("getFilesText");
  const supaAdmin = getSuperSupabase();
  let text = "";
  for (const file of files) {
    const document = await supaAdmin.storage
      .from("patient-documents")
      .download(`${folderName}/${file.name}`);
    if (document.error) {
      console.error(document.error);
      continue;
    }
    text += (await extractText(await document.data.arrayBuffer())).text;
  }
  console.timeEnd("getFilesText");
  return text;
}