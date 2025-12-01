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

// LAPOR KETIDAKHADIRAN
router.post("/lapor", auth, upload.single("bukti"), absensiController.laporAbsen);

// GET LAPORAN USER LOGIN
router.get("/laporan", auth, absensiController.getLaporan);

// GET ALL LAPORAN (ADMIN)
router.get("/laporan/all", auth, absensiController.getAllLaporan);

// RESPOND LAPORAN (ADMIN)
router.put("/laporan/:id", auth, absensiController.respondLaporan);

export default router;
