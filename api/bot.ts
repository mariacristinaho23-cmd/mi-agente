import { webhookCallback } from "grammy";
import { createTelegramBot } from "../src/bot/telegram.js";
import { validateConfig } from "../src/config/env.js";

// Validar credenciales y construir el bot
validateConfig();
const bot = createTelegramBot();

// Vercel Serverless Function entrypoint
export default webhookCallback(bot, "http");
