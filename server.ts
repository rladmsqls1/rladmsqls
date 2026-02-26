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

  // Ensure upload directories exist
  const reportsDir = path.join(__dirname, "uploads", "reports");
  const imagesDir = path.join(__dirname, "uploads", "images");
  [reportsDir, imagesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Configure Multer for reports
  const reportStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, reportsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });

  // Configure Multer for images
  const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, imagesDir);
    },
    filename: (req, file, cb) => {
      // For the about image, we can just use a fixed name or a unique one
      const ext = path.extname(file.originalname);
      cb(null, `about-image${ext}`);
    },
  });

  const uploadReport = multer({ storage: reportStorage });
  const uploadImage = multer({ storage: imageStorage });

  app.use(express.json());

  // API Routes for Reports
  app.get("/api/reports", (req, res) => {
    try {
      const files = fs.readdirSync(reportsDir);
      const reports = files.map(file => ({
        name: file.split("-").slice(1).join("-"),
        url: `/uploads/reports/${file}`,
        id: file
      }));
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to list reports" });
    }
  });

  app.post("/api/reports/upload", uploadReport.single("report"), (req, res) => {
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

  // API Routes for Images
  app.get("/api/about-image", (req, res) => {
    try {
      const files = fs.readdirSync(imagesDir).filter(f => f.startsWith("about-image"));
      if (files.length > 0) {
        // Return the most recent one (though we overwrite, just in case)
        res.json({ url: `/uploads/images/${files[0]}?t=${Date.now()}` });
      } else {
        res.json({ url: null });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to get about image" });
    }
  });

  app.post("/api/about-image/upload", uploadImage.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }
    res.json({ 
      message: "Image uploaded successfully",
      url: `/uploads/images/${req.file.filename}?t=${Date.now()}`
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
