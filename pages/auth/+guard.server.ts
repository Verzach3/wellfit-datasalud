import { PageContext } from "vike/types";
import { safeGetUser } from "../../util/supabase/safeGetSession.server";
import { redirect } from "vike/abort";

export async function guard(pageContext: PageContext) {
  const { supabase, token } = pageContext;
  if (!token) {
    return;
  }
  const user = await safeGetUser(supabase, token);
  console.log("auth:guard - user", user);
  if (!user) {
    console.log("auth:guard - No session found, continuing...");
    return;
  }
  console.log(`Session found for ${user.email} redirecting...`);
  throw redirect("/");
}
