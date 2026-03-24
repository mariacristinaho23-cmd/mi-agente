import { webhookCallback } from "grammy";
import { createTelegramBot } from "../src/bot/telegram";
import { validateConfig } from "../src/config/env";

// Retrasamos la validación hasta que llegue al handler, o si no exportamos un handler seguro.
let bot: any;
try {
  validateConfig();
  bot = createTelegramBot();
} catch (e: any) {
  console.error("ERROR CREANDO BOT:", e.message);
  // Un bot de respaldo que no hace nada para que The Vercel function can compile but returns 500 cleanly
}

// Eliminado maxDuration de exportación explícita (puesto en vercel.json)

export default async function handle(req: any, res: any) {
  if (!bot) {
    return res.status(500).json({ error: "El bot no inicializó correctamente." });
  }

  // Utilizamos el adaptador "express" de grammy que funciona nativamente con
  // la API de Node.js de Vercel porque Vercel ya parsea req.body como JSON.
  // webhookCallback se encarga de llamar a bot.init() si es necesario.
  const fn = webhookCallback(bot, "express", { timeoutMilliseconds: 55000 });
  
  return fn(req, res);
}
