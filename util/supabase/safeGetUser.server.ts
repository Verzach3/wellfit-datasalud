import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function safeGetUser(
  supabase: SupabaseClient,
): Promise<User | null> {
  let user = null;
  try {
    const {
      data: { user: resUser },
      error,
    } = await supabase.auth.getUser();
    console.log("safeGetUser:resUser", error);
    if (error) {
      // JWT validation has failed
      return null;
    }
    user = resUser;
  } catch (error) {
    // verification failed
    return null;
  }

  return user;
}
