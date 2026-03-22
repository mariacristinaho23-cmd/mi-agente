import dotenv from "dotenv";

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const vercelDomain = process.argv[2];

if (!token || !vercelDomain) {
  console.error("Uso: node set-webhook.js <tu-dominio-vercel.vercel.app>");
  process.exit(1);
}

const url = `https://${vercelDomain}/api/bot`;
const apiUrl = `https://api.telegram.org/bot${token}/setWebhook?url=${url}`;

console.log(`Configurando Webhook en: ${url}`);

fetch(apiUrl)
  .then((res) => res.json())
  .then((data) => {
    console.log("Respuesta de Telegram:", data);
  })
  .catch((err) => {
    console.error("Error seteando webhook:", err);
  });
