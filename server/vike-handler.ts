/// <reference lib="webworker" />
import { renderPage } from "vike/server";
import type { Context } from "hono";
export async function vikeHandler(
  request: Request,
  // biome-ignore lint/complexity/noBannedTypes: the type in the lib is defined like that
  context: Context<{}, "*", {}>
): Promise<Response> {
  const pageContextInit = {
    ...context,
    urlOriginal: request.url,
  };
  const pageContext = await renderPage(pageContextInit);
  const response = pageContext.httpResponse;

  const { readable, writable } = new TransformStream();

  response?.pipe(writable);

  return new Response(readable, {
    status: response?.statusCode,
    headers: response?.headers,
  });
}
