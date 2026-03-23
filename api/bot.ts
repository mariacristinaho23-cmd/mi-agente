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

export const maxDuration = 60; // Maximo en Vercel Hobby para dar tiempo a que la IA piense

export default async function handle(req: any, res: any) {
  if (!bot) {
    return res.status(500).json({ error: "El bot no inicializó correctamente." });
  }

  if (req.method === "POST" && req.body) {
    try {
      console.log("Recibido update:", JSON.stringify(req.body).substring(0, 100));
      // Esperamos a que el bot termine de contestar
      await bot.handleUpdate(req.body);
      res.status(200).json({ ok: true });
    } catch (error: any) {
      console.error("Error procesando mensaje:", error);
      // Retornar 200 para que Telegram no reintente el mismo error 100 veces
      res.status(200).json({ error: error.message });
    }
  } else {
    // Si alguien entra desde el navegador web
    res.status(200).send("🤖 Agente online y escuchando (Webhook Vercel).");
  }
}
