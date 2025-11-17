import Absensi from "../models/Absensi.js";
import moment from "moment-timezone";
import cloudinary from "../config/cloudinary.js";
import axios from "axios";

// =========================
// ABSEN MASUK
// =========================
export const absenMasuk = async (req, res) => {
  try {
    // Get userId dan today FIRST sebelum gunakan
    const userId = req.user.id;
    const today = moment.tz("Asia/Jakarta").startOf("day").toDate();
    const now = new Date();
    let status = now.getHours() >= 9 ? "telat" : "hadir";
    const { keterangan = "", status: statusOverride } = req.body || {};
    let fotoUrl = null;

    // cek apakah sudah absen masuk hari ini
    const existing = await Absensi.findOne({ userId, tanggal: today });
    if (existing) {
      return res.status(400).json({ message: "Anda sudah absen masuk hari ini!" });
    }
    
    // Jika ada file (multer) upload ke Cloudinary
    if (req.file && req.file.buffer) {
      try {
        // Use cloudinary SDK dengan Stream
        const uploadResult = await new Promise((resolve, reject) => {
          let uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "absensi-presensi",
              resource_type: "auto"
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          
          uploadStream.end(req.file.buffer);
          
          // Set timeout untuk prevent hanging
          setTimeout(() => {
            if (!uploadStream.destroyed) {
              uploadStream.destroy();
              reject(new Error('Upload timeout'));
            }
          }, 30000);
        });
        
        fotoUrl = uploadResult.secure_url;
        
      } catch (uploadErr) {
        // Jika upload gagal, lanjutkan dengan fotoUrl = null
        // User bisa retry upload
        fotoUrl = null;
      }
    }
    
    if (statusOverride && ["hadir","telat","izin","sakit"].includes(statusOverride)) {
      status = statusOverride; // jika admin/client override (misal izin)
    }

    // buat data absensi
    const absen = await Absensi.create({
      userId,
      tanggal: today,
      jamMasuk: now,
      status,
      keterangan,
      foto: fotoUrl,
    });

    return res.status(201).json({
      message: "Absen masuk berhasil!",
      data: absen,
    });

  } catch (err) {
    console.error('absenMasuk error:', err.message);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =========================
// ABSEN PULANG
// =========================
export const absenPulang = async (req, res) => {
  try {
    const userId = req.user.id;
  const today = moment.tz("Asia/Jakarta").startOf("day").toDate();

    const absen = await Absensi.findOne({ userId, tanggal: today });

    if (!absen) {
      return res.status(400).json({ message: "Anda belum absen masuk!" });
    }

    if (absen.jamPulang) {
      return res.status(400).json({ message: "Anda sudah absen pulang!" });
    }

    const { keterangan = "" } = req.body || {};
    if (keterangan) absen.keterangan = keterangan; // update keterangan saat pulang
  absen.jamPulang = new Date();
    await absen.save();

    return res.status(200).json({
      message: "Absen pulang berhasil!",
      data: absen,
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =========================
// RIWAYAT ABSENSI USER LOGIN
// =========================
export const getRiwayat = async (req, res) => {
  try {
    const userId = req.user.id;

    const riwayat = await Absensi.find({ userId }).sort({ tanggal: -1 });

    return res.status(200).json({
      message: "Berhasil mengambil riwayat absensi",
      data: riwayat,
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
