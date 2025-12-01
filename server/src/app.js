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
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CORS_ORIGIN || "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://localhost:5177",
      "http://10.121.20.89:5173",
      "http://127.0.0.1:5173"
    ];
    
    // Allow all Vercel preview URLs
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for development
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// ======================
// ROUTES
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/absensi", absensiRoutes);

// ======================
// DEFAULT ROUTE - API DOCUMENTATION
// ======================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "api-docs.html"));
});

export default app;
