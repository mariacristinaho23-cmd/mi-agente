import { Bot } from "grammy";
import { config } from "../config/env";
import { runAgentLoop } from "../agent/loop";

export function createTelegramBot() {
  const bot = new Bot(config.telegram.botToken);

  // Auth Middleware
  bot.use(async (ctx, next) => {
    if (!ctx.from) return;
    const userId = String(ctx.from.id);

    if (!config.telegram.allowedUserIds.includes(userId)) {
      console.log(`[Telegram] Acceso denegado al user ID: ${userId}`);
      await ctx.reply("❌ Acceso denegado. No te encuentras en la lista blanca.");
      return;
    }

    await next();
  });

  bot.command("start", async (ctx) => {
    await ctx.reply("Bienvenido a OpenGravity. Modos de memoria y agent loop están habilitados. ¿En qué te ayudo hoy?");
  });

  bot.on("message:text", async (ctx) => {
    const text = ctx.message.text;
    const userId = String(ctx.from.id);

    // Typing indication (optional visual cue)
    await ctx.replyWithChatAction("typing");

    try {
      const response = await runAgentLoop(userId, text);
      await ctx.reply(response);
    } catch (error: any) {
      await ctx.reply(`⚠️ Ups, ha habido un problema: ${error.message}`);
    }
  });

  return bot;
}
