import { webhookCallback } from "grammy";
import { createTelegramBot } from "../src/bot/telegram.js";
import { validateConfig } from "../src/config/env.js";

// Retrasamos la validación hasta que llegue al handler, o si no exportamos un handler seguro.
let bot: any;
try {
  validateConfig();
  bot = createTelegramBot();
} catch (e: any) {
  console.error("ERROR CREANDO BOT:", e.message);
  // Un bot de respaldo que no hace nada para que The Vercel function can compile but returns 500 cleanly
}

export default async function handle(req: any, res: any) {
  if (!bot) {
    res.status(500).json({ error: "El bot no se configuró correctamente. Revisa tus Variables de Entorno en Vercel." });
    return;
  }
  return webhookCallback(bot, "http")(req, res);
}
