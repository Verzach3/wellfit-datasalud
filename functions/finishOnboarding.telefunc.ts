import { getContext } from "telefunc";
import type { ContextVariableMap } from "hono";
import { safeGetUser } from "@/util/supabase/safeGetUser.server";
import { createError } from "@/util/createError";
export async function finishOnboarding() {
  const { supabase, token } = getContext<ContextVariableMap>();
  if (!token) {
    return createError("No se encontro la sesion", 401);
  }
  const user = safeGetUser(supabase, token);
}
