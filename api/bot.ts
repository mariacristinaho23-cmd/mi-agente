import { webhookCallback } from "grammy";
import { createTelegramBot } from "./_src/bot/telegram.js";
import { validateConfig } from "./_src/config/env.js";

let bot: any;
try {
  validateConfig();
  bot = createTelegramBot();
} catch (e: any) {
  console.error("ERROR CREANDO BOT:", e.message);
}

export default async function handle(req: any, res: any) {
  if (!bot) {
    return res.status(500).json({ error: "El bot no inicializó correctamente." });
  }
  const fn = webhookCallback(bot, "express", { timeoutMilliseconds: 55000 });
  return fn(req, res);
}
