import type { PageContext } from "vike/types";
import { safeGetUser } from "../util/supabase/safeGetUser.server";
import { redirect, render } from "vike/abort";
import type { User } from "@supabase/supabase-js";
import { getSuperSupabase } from "@/util/supabase/getSuperSupabase.server";

export async function guard(pageContext: PageContext) {
  const { supabase } = pageContext;
  let user: User;

  try {
    const res = await safeGetUser(supabase);
    if (res === null && pageContext.urlPathname !== "/auth") {
      console.log("no session");
      throw render("/auth");
    } 
    user = <User> res;
  } catch (error) {
    console.error("index:guard:Error in guard", error);
    throw render("/auth");
  }

  const supabaseadmin = getSuperSupabase();

  const profile = await supabaseadmin
    .from("profiles")
    .select("*")
    .eq("user_id", user.id);

  console.log("index:guard:Profile data", profile.data);
  if (
    profile.data !== null &&
    profile.data.length === 0 &&
    pageContext.urlPathname !== "/onboarding"
  ) {
    console.log("index:guard:Redirecting to /onboarding");
    throw redirect("/onboarding");
  }

  const role = await supabaseadmin.from("asigned_roles").select("*, roles(*)").eq("user_id", user.id);
  console.log("index:guard:Role data", role.data);

  if (role.data !== null && role.data.length > 0 && role.data[0].roles?.role_name === "admin" && pageContext.urlPathname !== "/admin") {
    console.log("index:guard:User is admin");
    throw redirect("/admin");

  }

}
