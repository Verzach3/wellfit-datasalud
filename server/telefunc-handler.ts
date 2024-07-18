import { telefunc } from "telefunc";
import type { Context } from "hono";
export async function telefuncHandler(
  request: Request,
  // biome-ignore lint/complexity/noBannedTypes: the type is defined like that in the lib 
  context: Context<{}, "*", {}>
): Promise<Response> {
  const httpResponse = await telefunc({
    url: request.url.toString(),
    method: request.method,
    body: await request.text(),
    context: {
      ...context,
      // @ts-expect-error
      supabase: context.supabase
    },
  });
  const { body, statusCode, contentType } = httpResponse;
  return new Response(body, {
    status: statusCode,
    headers: {
      "content-type": contentType,
    },
  });
}
