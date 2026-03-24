import { validateConfig } from "./config/env";
import { createTelegramBot } from "./bot/telegram";


async function bootstrap() {
  try {
    console.log("[Setup] Iniciando OpenGravity...");
    validateConfig();
    console.log("[Setup] Checkeo de entorno pasado correctamente.");

    console.log("[Setup] Configurando y arrancando grammyjs telegram bot...");
    const bot = createTelegramBot();

    bot.catch((err) => {
      console.error(`[Fatal Error] Telegram grammyjs:`, err);
    });

    await bot.start({
      onStart: (botInfo) => {
        console.log(`[Success] 🤖 Escuchando peticiones en @${botInfo.username}! (Long Polling)`);
      },
    });
  } catch (e: any) {
    console.error(`❌ Fallo crítico al iniciar el agente:`, e.message);
    process.exit(1);
  }
}

bootstrap();
