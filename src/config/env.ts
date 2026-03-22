import dotenv from "dotenv";

dotenv.config();

export const config = {
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || "",
    allowedUserIds: (process.env.TELEGRAM_ALLOWED_USER_IDS || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean),
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY || "",
  },
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY || "",
    model: process.env.OPENROUTER_MODEL || "openrouter/free",
  },
};

export function validateConfig() {
  if (!config.telegram.botToken || config.telegram.botToken.includes("SUTITUYE")) {
    throw new Error("TELEGRAM_BOT_TOKEN no configurado en '.env'. Por favor, configúralo.");
  }

  if (config.telegram.allowedUserIds.length === 0 || config.telegram.allowedUserIds[0].includes("SUTITUYE")) {
    throw new Error("TELEGRAM_ALLOWED_USER_IDS no configurado en '.env'. Por favor, configúralo.");
  }
}
