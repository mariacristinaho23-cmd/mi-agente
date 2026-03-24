export default function handler(req: any, res: any) {
  res.status(200).json({ status: "alive", env: Object.keys(process.env).filter(k => k.includes("FIREBASE") || k.includes("TELEGRAM")) });
}
