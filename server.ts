import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { MarketService } from "./src/server/services/MarketService.js";
import { ScanService } from "./src/server/services/ScanService.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // SQL-backed Market Data API
  app.get("/api/market-prices", (req, res, next) => {
    try {
      const prices = MarketService.getAllPrices();
      res.json(prices);
    } catch (error) {
      next(error);
    }
  });

  // SQL-backed Scan History API
  app.get("/api/scans", (req, res, next) => {
    try {
      const history = ScanService.getRecentHistory();
      res.json(history);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/scans", (req, res, next) => {
    try {
      const { disease_name, confidence, image_data } = req.body;
      if (!disease_name || confidence === undefined) {
        return res.status(400).json({ error: "Missing required fields: disease_name or confidence" });
      }
      const record = ScanService.saveScan({ disease_name, confidence, image_data });
      res.status(201).json(record);
    } catch (error) {
      next(error);
    }
  });

  // Global Exception Handling Middleware (DBMS Style)
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`[SERVER_EXCEPTION] ${new Date().toISOString()}:`, err);
    
    const statusCode = err.message.startsWith('DBMS_ERROR') ? 500 : 400;
    res.status(statusCode).json({
      error: "Internal Server Exception",
      message: err.message || "An unexpected error occurred in the data layer.",
      timestamp: new Date().toISOString()
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
