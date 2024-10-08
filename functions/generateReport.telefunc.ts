import { getOpenAI } from "@/util/getOpenai";
import { getSuperSupabase } from "@/util/supabase/getSuperSupabase.server";
import type { FileObject } from "@supabase/storage-js";
import { extractText } from "unpdf"
export async function generateReport(folderName: string, files: FileObject[]) {
  console.time("generateReport")
  const openai = getOpenAI();
  const supaAdmin = getSuperSupabase();
  let text = ""
  for (const file of files) {
    const document = await supaAdmin.storage.from("patient-documents").download(`${folderName}/${file.name}`)
    if (document.error) {
      console.error(document.error)
      continue
    }
    text += (await extractText(await document.data.arrayBuffer())).text
 }
 const report = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {role: "system", content: initialMessage},
      {role: "user", content: text}
    ],
    max_completion_tokens: 2500,
  })
  console.timeEnd("generateReport")
  return report.choices[0].message.content ?? ""
}

const initialMessage =`Eres DataSalud Report AI, estas aquí para ayudar a generar un informe médico detallado y completo para los pacientes, usa markdown.
Primero: Con la informacion cargada , se requiere definir el perfil del paciente detallado y con explicaiones claras y extensas y de acuerdo a esto , elaborame un analisis exhaustivo y lo mas extenso posible de cada uno de los diagnosticos y finalmente identificar los puntos que que no se esten teniendo en cuenta en los diagnosticos, actualizar datos teniendo en cuenta que la fecha de nacimiento del paciente es 13-05-1972

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
`