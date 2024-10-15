import "dotenv/config";
import { type CookieMethodsServer, createServerClient } from "@supabase/ssr";
import { vikeHandler } from "./server/vike-handler";
import { telefuncHandler } from "./server/telefunc-handler";
import { Hono, type Context } from "hono";
import { createMiddleware } from "hono/factory";
import { getCookie, setCookie } from "hono/cookie";
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { streamText as honoStream } from "hono/streaming"

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
let serveStatic: any;
// detect if is node or Bun
// @ts-expect-error
if (global.Bun !== undefined) {
  serveStatic = (await import ("hono/bun")).serveStatic;
} else {
  serveStatic = (await import ("@hono/node-server/serve-static")).serveStatic;
}

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

const openai = createOpenAI({
  apiKey: process.env.OPENAI_KEY ?? '',
});

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
        setAll: (cookies: { name: string; value: string }[]) => {
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

app.post("/api/chat", async (context) => {
  return honoStream(context, async (stream) => {

    const { messages } = await context.req.json();
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: messages,
    })

        // Mark the response as a v1 data stream:
    context.header('X-Vercel-AI-Data-Stream', 'v1');
    context.header('Content-Type', 'text/plain; charset=utf-8');
    
    const dataStream = result.toDataStream();
    
    await stream.pipe(dataStream);

  })


})


const completionsPrompt = `Eres DataSalud Report AI, estas aquí para ayudar a generar un informe médico detallado y completo para los pacientes, usa markdown.
Primero: Con la informacion cargada , se requiere definir el perfil del paciente extenso, detallado y con explicaiones claras y extensas y de acuerdo a esto , elaborame un analisis exhaustivo y lo mas extenso posible de cada uno de los diagnosticos y finalmente identificar los puntos que que no se esten teniendo en cuenta en los diagnosticos, actualizar datos teniendo en cuenta que la fecha de nacimiento del paciente es 13-05-1972

Basado en la información médica disponible, se requiere desarrollar un perfil detallado del paciente, proporcionando explicaciones claras y exhaustivas para cada aspecto relevante, el informe debe ser extenso, profundo y lo más detallado posible, con información que el paciente pueda entender. Este perfil debe incluir un análisis minucioso de cada uno de los diagnósticos médicos proporcionados, identificando posibles omisiones o áreas no consideradas en los diagnósticos actuales. La información del paciente debe ser actualizada con datos relevantes y recientes.
Las secciones que deben ser abordadas en el informe son:
•	Datos del Paciente: Información básica como edad, sexo y condiciones preexistentes.
•	 Historia Reciente: Descripción detallada de la salud del paciente en los últimos meses.
•	Tratamiento Actual: Enumeración de medicamentos y terapias en curso.
•	Respuestas al Tratamiento: Evaluación de la efectividad de los tratamientos actuales.
•	Análisis de Evolución de historias clínicas y su tratamiento.  
•	Recomendaciones de Manejo: Sugerencias para optimizar el manejo médico del paciente.
•	Áreas de Oportunidad y Sugerencias de Mejora : Identificación de falencias en el tratamiento actual y recomendaciones para mejorarlo.
•	Tabla FHIR: Detalles de alergias, diagnósticos, tratamientos, procedimientos, cirugías y medicamentos.
•	Tratamiento Holístico - Natural Sugerido: Alternativas naturales o holísticas que podrían complementar el tratamiento convencional.
•	Aportes Finales: Conclusiones y recomendaciones finales para la mejora continua del cuidado del paciente.


**de acuerdo al reporte cargado que preguntas pueden hacersele al paciente para obtener informacion adicional para hacer analisis y recomendaciones
`;


app.post("/api/completion", async (context) => {
  return honoStream(context, async (stream) => {

    const { prompt } = await context.req.json();
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: completionsPrompt,
      prompt: prompt,
    })

        // Mark the response as a v1 data stream:
    context.header('X-Vercel-AI-Data-Stream', 'v1');
    context.header('Content-Type', 'text/plain; charset=utf-8');
    
    const dataStream = result.toDataStream();
    
    await stream.pipe(dataStream);

  })


})

app.post("/_telefunc", handlerAdapter(telefuncHandler));

app.use(
  "/*",
  serveStatic({
    root: "./dist/client/",
  }),
);

/**
 * Vike route
 *
 * @link {@see https://vike.dev}
 **/
app.all("*", handlerAdapter(vikeHandler));

export default app;