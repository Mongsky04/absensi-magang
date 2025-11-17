import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the parent directory (server root)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import absensiRoutes from "./routes/absensi.routes.js";

const app = express();

// ======================
// CORS CONFIG
// ======================
const corsOptions = {
  origin: [
    process.env.CORS_ORIGIN || "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5174",
    "https://*.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// ======================
// ROUTES
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/absensi", absensiRoutes);

// ======================
// DEFAULT ROUTE
// ======================
app.get("/", (req, res) => {
  res.send("✅ API Absensi Magang berjalan...");
});

export default app;
