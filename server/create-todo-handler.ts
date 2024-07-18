import type { ContextVariableMap } from "hono"
export async function createTodoHandler<
  Hono,
>(request: Request, context?: ContextVariableMap): Promise<Response> {
  // In a real case, user-provided data should ALWAYS be validated with tools like zod
  if (!context) {
    return new Response("Context is not provided", { status: 500 });
  }
  
  const newTodo = (await request.json()) as { text: string };

  console.log("Received new todo", newTodo);

  return new Response(JSON.stringify({ status: "OK" }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}
