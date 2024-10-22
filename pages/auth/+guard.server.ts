import { PageContext } from "vike/types";
import { safeGetUser } from "../../util/supabase/safeGetUser.server";
import { redirect } from "vike/abort";

export async function guard(pageContext: PageContext) {
  const { supabase } = pageContext;
  const user = await safeGetUser(supabase);
  console.log("auth:guard - user", user);
  if (!user) {
    console.log("auth:guard - No session found, continuing...");
    return;
  }
  console.log(`Session found for ${user.email} redirecting...`);
  throw redirect("/");
}
