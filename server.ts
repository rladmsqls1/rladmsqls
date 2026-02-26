import express from "express";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Ensure upload directory exists
  const uploadDir = path.join(__dirname, "uploads", "reports");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Configure Multer
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });

  const upload = multer({ storage });

  app.use(express.json());

  // API Routes
  app.get("/api/reports", (req, res) => {
    try {
      const files = fs.readdirSync(uploadDir);
      const reports = files.map(file => ({
        name: file.split("-").slice(1).join("-"), // Remove unique prefix
        url: `/uploads/reports/${file}`,
        id: file
      }));
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to list reports" });
    }
  });

  app.post("/api/reports/upload", upload.single("report"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ 
      message: "File uploaded successfully",
      file: {
        name: req.file.filename.split("-").slice(1).join("-"),
        url: `/uploads/reports/${req.file.filename}`,
        id: req.file.filename
      }
    });
  });

  // Serve uploaded files
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
