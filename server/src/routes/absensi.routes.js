import express from "express";
import * as absensiController from "../controllers/absensi.controller.js";
import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// =========================
// ABSENSI ROUTES
// =========================

// ABSEN MASUK
router.post("/masuk", auth, upload.single("foto"), absensiController.absenMasuk);

// ABSEN PULANG
router.post("/pulang", auth, absensiController.absenPulang);

// RIWAYAT ABSENSI USER LOGIN
router.get("/riwayat", auth, absensiController.getRiwayat);

export default router;
