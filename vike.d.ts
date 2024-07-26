import type { Database } from "./types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
declare module "hono" {
  interface ContextVariableMap {
    supabase: SupabaseClient<Database>;
    token: string | undefined;
  }
}

// extend globalThis with supabase
import { createClient } from "@supabase/supabase-js";
declare global {
  var supabase: SupabaseClient<Database>;
  namespace Vike {
		interface PageContext {
      supabase: SupabaseClient<Database>;
      token: string | undefined;
    }
  }
}
