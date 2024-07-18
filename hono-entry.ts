import "dotenv/config";
import { type CookieMethodsServer, createServerClient } from "@supabase/ssr";
import { vikeHandler } from "./server/vike-handler";
import { telefuncHandler } from "./server/telefunc-handler";
import { Hono, type Context } from "hono";
import { createMiddleware } from "hono/factory";
import { getCookie, setCookie } from "hono/cookie";

type Middleware = (
  request: Request,
  // biome-ignore lint/complexity/noBannedTypes: the type is defined like that in the lib
  context: Context<{}, "*", {}>,
) => Response | void | Promise<Response> | Promise<void>;

export function handlerAdapter(handler: Middleware) {
  return createMiddleware(async (context, next) => {
    let ctx = context.get("context");
    if (!ctx) {
      ctx = {
        supabase: context.get("supabase"),
        token: context.get("token"),
      };
      context.set("context", ctx);
    }

    const res = await handler(context.req.raw, ctx as Context);
    context.set("context", ctx);

    if (!res) {
      await next();
    }

    return res;
  });
}

const app = new Hono();
app.all("*", async (context, next) => {
  context.set("token", getCookie(context, "token"));
  const serverClient = createServerClient(
    process.env.PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll: () => {
          const cookies: Record<string, string> = getCookie(context);
          const cookiesArr = [];
          for (const key in cookies) {
            if (cookies[key] === "") {
              cookiesArr.push({ name: key, value: cookies[key] ?? "" });
            }
          }
          return cookiesArr;
        },
        setAll: (cookies) => {
          for (const cookie of cookies) {
            setCookie(context, cookie.name, cookie.value);
          }
        },
      } satisfies CookieMethodsServer,
    },
  );
  context.set("supabase", serverClient);
  await next();
});

app.post("/_telefunc", handlerAdapter(telefuncHandler));

/**
 * Vike route
 *
 * @link {@see https://vike.dev}
 **/
app.all("*", handlerAdapter(vikeHandler));

export default app;
