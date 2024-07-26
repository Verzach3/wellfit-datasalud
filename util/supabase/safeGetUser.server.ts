import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function safeGetUser(
  supabase: SupabaseClient,
  token: string,
): Promise<User | null> {
  if (!token) {
    console.log("SafeGetSession - No token provided!!");
  }

  let user = null;
  try {
    const {
      data: { user: resUser },
      error,
    } = await supabase.auth.getUser(token);
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
