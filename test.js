import { config } from "./src/config/env.js";
import { chatCompletion } from "./src/agent/llm.js";
import { availableTools } from "./src/agent/tools.js";

async function main() {
  try {
    const response = await chatCompletion([
      { role: "system", content: "You are an agent." },
      { role: "user", content: "hi" }
    ], availableTools);
    console.log(response);
  } catch (e) {
    console.error(e);
  }
}
main();
