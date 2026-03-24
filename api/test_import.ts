import { config } from "./_src/config/env";
export default function handler(req: any, res: any) {
  res.status(200).json({ token: config.telegram.botToken ? "yes" : "no" });
}
