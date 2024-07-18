import type { PageContext } from "vike/types";
import { safeGetUser } from "../util/supabase/safeGetSession.server";
import { redirect, render } from "vike/abort";

export async function guard(pageContext: PageContext) {
  const { supabase, token } = pageContext;
  if (!token && pageContext.urlPathname !== "/auth") {
    console.log("Redirecting to /auth");
    throw render("/auth");
  }
  try {
    const user = await safeGetUser(supabase, token ?? "");
    if (!user) {
      console.log("no session");
      throw render("/auth");
    }
  } catch (error) {
    console.error("index:guard:Error in guard", error);
    throw render("/auth");
  }
}
