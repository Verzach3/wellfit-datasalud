import type { ContextVariableMap } from "hono";
import OpenAI from "openai";
import { getContext } from "telefunc";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export async function createReport(filePath: string) {
  const { supabase, token } = getContext<ContextVariableMap>()
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt}],
    model: "gpt-4o-mini"
  })

  const user = await supabase.auth.getUser(token);
  if (!user.data.user) {
    throw new Error("User not found")
  }

  await supabase.from("reports").insert({
    user_id: user.data.user.id,
    report: chatCompletion.choices[0].message.content ?? "",
  })


}


const prompt = `PROMPT
Primero: Con la informacion cargada , se requiere definir el perfil del paciente detallado y
con explicaiones claras y extensas y de acuerdo a esto , elaborame un analisis exhaustivo y
lo mas extenso posible de cada uno de los diagnosticos y finalmente identificar los puntos
que que no se esten teniendo en cuenta en los diagnosticos, actualizar datos teniendo en
cuenta que la fecha de nacimiento del paciente es 13-05-1972
Basado en la información médica disponible, se requiere desarrollar un perfil
detallado del paciente, proporcionando explicaciones claras y exhaustivas para
cada aspecto relevante, el informe debe ser extenso, profundo y lo más detallado
posible, con información que el paciente pueda entender. Este perfil debe incluir un
análisis minucioso de cada uno de los diagnósticos médicos proporcionados,
identificando posibles omisiones o áreas no consideradas en los diagnósticos
actuales. La información del paciente debe ser actualizada con datos relevantes y
recientes.
Las secciones que deben ser abordadas en el informe son:
 Datos del Paciente: Información básica como edad, sexo y condiciones
preexistentes.
 Historia Reciente: Descripción detallada de la salud del paciente en los
últimos meses.
 Tratamiento Actual: Enumeración de medicamentos y terapias en curso.
 Respuestas al Tratamiento: Evaluación de la efectividad de los tratamientos
actuales.
 Análisis de Evolución de historias clínicas y su tratamiento.
 Recomendaciones de Manejo: Sugerencias para optimizar el manejo médico
del paciente.
 Áreas de Oportunidad y Sugerencias de Mejora : Identificación de falencias
en el tratamiento actual y recomendaciones para mejorarlo.
 Tabla FHIR: Detalles de alergias, diagnósticos, tratamientos, procedimientos,
cirugías y medicamentos.
 Tratamiento Holístico – Natural Sugerido: Alternativas naturales o holísticas
que podrían complementar el tratamiento convencional.
 Aportes Finales: Conclusiones y recomendaciones finales para la mejora
continua del cuidado del paciente.
**de acuerdo al reporte cargado que preguntas pueden hacersele al paciente para obtener
informacion adicional para hacer analisis y recomendaciones
`