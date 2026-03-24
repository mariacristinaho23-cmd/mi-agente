import { initializeApp } from "firebase/app";

export default function handler(req: any, res: any) {
  res.status(200).json({ ok: typeof initializeApp });
}
