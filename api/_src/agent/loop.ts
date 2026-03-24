import { memory } from "../memory/firebase.js";
import { chatCompletion, APIMessage } from "./llm.js";
import { availableTools, executeTool } from "./tools.js";

const MAX_ITERATIONS = 5;

const SYSTEM_PROMPT = `
Eres OpenGravity, un agente autónomo de Inteligencia Artificial que se ejecuta de manera local y 100% privada.
Tu única interfaz de momento es este chat de Telegram.
Puedes utilizar herramientas si se te proporcionan. Hoy dispones de un comando de fecha y hora.
Prioriza la seguridad, simplicidad, eficiencia y la claridad en tus respuestas. Eres completamente consciente del entorno en el que corres.
Responde natural, pero puedes detallar tus procesos si es oportuno.
`;

export async function runAgentLoop(userId: string | number, userMessage: string): Promise<string> {
  const history = await memory.getHistory(userId, 15);
  
  const messages: APIMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  for (const m of history) {
    if (m.role === "user" || m.role === "assistant" || m.role === "system" || m.role === "tool") {
      messages.push({ role: m.role, content: m.content });
    }
  }

  messages.push({ role: "user", content: userMessage });
  await memory.saveMessage(userId, "user", userMessage);

  let iterations = 0;
  let finalResponse = "Sin respuesta generada";

  while (iterations < MAX_ITERATIONS) {
    iterations++;
    console.log(`[Agent Loop] Iteración ${iterations} / ${MAX_ITERATIONS}...`);

    try {
      const response = await chatCompletion(messages, availableTools);

      if (!response.tool_calls || response.tool_calls.length === 0) {
        finalResponse = response.content || "Ok.";
        await memory.saveMessage(userId, "assistant", finalResponse);
        break;
      } else {
        console.log(`[Agent Loop] Herramientas detectadas. Llamando a tools...`);
        messages.push(response);

        for (const toolCall of response.tool_calls) {
          const functionName = toolCall.function.name;
          let args = {};
          
          try {
             args = JSON.parse(toolCall.function.arguments || "{}");
          } catch (e) {
             console.error("[Agent Loop] No se pudieron parsear los tool args:", toolCall.function.arguments);
          }
          
          const toolOutput = await executeTool(functionName, args);
          
          messages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: functionName,
            content: toolOutput,
          });
        }
      }
    } catch (e: any) {
      console.error(`[Agent Loop Error]:`, e);
      finalResponse = `Hubo un error interno: ${e.message}`;
      await memory.saveMessage(userId, "assistant", finalResponse);
      break;
    }
  }

  if (iterations >= MAX_ITERATIONS) {
    finalResponse = "He alcanzado el límite de operaciones o pensamientos para esta petición.";
    await memory.saveMessage(userId, "assistant", finalResponse);
  }

  return finalResponse;
}
