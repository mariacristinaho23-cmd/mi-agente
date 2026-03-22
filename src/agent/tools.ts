export const availableTools = [
  {
    type: "function",
    function: {
      name: "get_current_time",
      description: "Obtiene la hora y fecha actual.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
];

export async function executeTool(name: string, args: Record<string, any>): Promise<string> {
  console.log(`[Tool] Ejecutando: ${name} con argumentos:`, args);
  switch (name) {
    case "get_current_time":
      const time = new Date().toISOString();
      console.log(`[Tool] get_current_time resultado: ${time}`);
      return time;
    default:
      console.error(`[Tool] Error: Tool '${name}' no fue encontrada.`);
      return `Error: Tool '${name}' no existe.`;
  }
}
