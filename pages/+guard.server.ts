import type { PageContext } from "vike/types";
import { safeGetUser } from "../util/supabase/safeGetUser.server";
import { redirect, render } from "vike/abort";
import type { User } from "@supabase/supabase-js";
import { getSuperSupabase } from "@/util/supabase/getSuperSupabase.server";

export async function guard(pageContext: PageContext) {
  const { supabase, token } = pageContext;
  if (!token && pageContext.urlPathname !== "/auth") {
    console.log("Redirecting to /auth");
    throw render("/auth");
  }

  let user: User;

  try {
    const res = await safeGetUser(supabase, <string>token);
    if (!res) {
      console.log("no session");
      throw render("/auth");
    }
    user = res;
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
