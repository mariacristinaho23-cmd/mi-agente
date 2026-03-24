import { config } from "../config/env";

export interface APIMessage {
  role: "system" | "user" | "assistant" | "tool";
  content?: string | null;
  tool_calls?: any[];
  tool_call_id?: string;
  name?: string;
}

export async function chatCompletion(messages: APIMessage[], toolsArray?: any[]) {
  const useGroq = Boolean(config.groq.apiKey && !config.groq.apiKey.includes("SUTITUYE"));
  
  const endpoint = useGroq 
    ? "https://api.groq.com/openai/v1/chat/completions"
    : "https://openrouter.ai/api/v1/chat/completions";

  const apiKey = useGroq ? config.groq.apiKey : config.openRouter.apiKey;
  const model = useGroq ? "llama-3.3-70b-versatile" : config.openRouter.model; // llama 3.3 70b o el configurado

  if (!apiKey || apiKey.includes("SUTITUYE")) {
    throw new Error("No hay API keys válidas configuradas para Groq u OpenRouter en .env.");
  }

  const payload: any = {
    model,
    messages,
  };

  if (toolsArray && toolsArray.length > 0) {
    payload.tools = toolsArray;
    payload.tool_choice = "auto";
  }

  console.log(`[LLM] Enviando petición a ${useGroq ? "Groq" : "OpenRouter"} usando el modelo ${model}...`);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`[LLM Error Response]:`, errText);
    throw new Error(`Error llamando a LLM: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message as APIMessage;
}
