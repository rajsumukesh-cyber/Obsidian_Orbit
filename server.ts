import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.use(express.json());

  app.get("/api/meetings/engagement", (req, res) => {
    // In a real app, this would query a database
    res.json([
      { day: 'Mon', engagement: 40 },
      { day: 'Tue', engagement: 55 },
      { day: 'Wed', engagement: 45 },
      { day: 'Thu', engagement: 70 },
      { day: 'Fri', engagement: 60 },
      { day: 'Sat', engagement: 30 },
      { day: 'Sun', engagement: 20 },
    ]);
  });

  app.post("/api/generate-action-items", (req, res) => {
    // Simulate AI parsing
    const { title } = req.body;
    const generatedItems = [
      `Review ${title} documentation`,
      `Follow up with stakeholders`,
      `Finalize preparation for next meeting`
    ];
    res.json({ actionItems: generatedItems });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
