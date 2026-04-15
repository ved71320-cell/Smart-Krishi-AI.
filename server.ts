import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock Market Data API
  app.get("/api/market-prices", (req, res) => {
    const prices = [
      { id: 1, crop: "Tomato", price: "₹40/kg", trend: "up", region: "Maharashtra" },
      { id: 2, crop: "Onion", price: "₹25/kg", trend: "down", region: "Maharashtra" },
      { id: 3, crop: "Potato", price: "₹20/kg", trend: "stable", region: "Maharashtra" },
      { id: 4, crop: "Wheat", price: "₹2,200/quintal", trend: "up", region: "Punjab" },
      { id: 5, crop: "Rice", price: "₹3,500/quintal", trend: "stable", region: "West Bengal" },
    ];
    res.json(prices);
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
