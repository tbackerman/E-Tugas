import { Request, Response } from "express";

let app: any;
let startupError: any = null;

try {
  // Dynamically import server.ts/js
  const serverModule = await import("../server.js");
  app = serverModule.default;
} catch (err: any) {
  startupError = {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code
  };
}

export default async function handler(req: Request, res: Response) {
  if (startupError) {
    console.error("Vercel Startup Error:", startupError);
    return res.status(500).json({
      error: "Gagal memuat server (Startup Error)",
      details: startupError
    });
  }
  if (!app) {
    return res.status(500).json({ error: "Server Express tidak terinisialisasi." });
  }
  return app(req, res);
}

