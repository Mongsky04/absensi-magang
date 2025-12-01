import Absensi from "../models/Absensi.js";
import LaporanAbsen from "../models/LaporanAbsen.js";
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
    const now = moment.tz("Asia/Jakarta");
    const currentHour = now.hour();
    
    // Validasi: Check-in hanya bisa dilakukan antara jam 06:00 - 17:00
    if (currentHour < 6 || currentHour >= 17) {
      return res.status(400).json({ 
        message: `Check-in hanya dapat dilakukan antara jam 06:00 - 17:00. Sekarang jam ${now.format('HH:mm')}.`,
        currentTime: now.format('HH:mm'),
        allowedTime: '06:00 - 17:00'
      });
    }

    let status = currentHour >= 9 ? "telat" : "hadir";
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
      jamMasuk: now.toDate(),
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
    const now = moment.tz("Asia/Jakarta");

    const absen = await Absensi.findOne({ userId, tanggal: today });

    if (!absen) {
      return res.status(400).json({ message: "Anda belum absen masuk!" });
    }

    if (absen.jamPulang) {
      return res.status(400).json({ message: "Anda sudah absen pulang!" });
    }

    // Validasi: Check-out hanya bisa dilakukan setelah jam 17:00
    const currentHour = now.hour();
    const currentMinute = now.minute();
    
    if (currentHour < 17) {
      return res.status(400).json({ 
        message: `Check-out hanya dapat dilakukan setelah jam 17:00. Sekarang jam ${now.format('HH:mm')}.`,
        currentTime: now.format('HH:mm'),
        allowedTime: '17:00'
      });
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

// =========================
// LAPOR KETIDAKHADIRAN
// =========================
export const laporAbsen = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tanggal, jenis, keterangan } = req.body;

    // Validation
    if (!tanggal || !jenis || !keterangan) {
      return res.status(400).json({ 
        message: "Tanggal, jenis, dan keterangan harus diisi" 
      });
    }

    if (!["izin", "sakit", "lupa"].includes(jenis)) {
      return res.status(400).json({ 
        message: "Jenis laporan tidak valid" 
      });
    }

    // Parse tanggal
    const laporanDate = moment.tz(tanggal, "Asia/Jakarta").startOf("day").toDate();
    const today = moment.tz("Asia/Jakarta").startOf("day").toDate();

    // Validasi: tanggal tidak boleh lebih dari hari ini
    if (laporanDate > today) {
      return res.status(400).json({ 
        message: "Tanggal laporan tidak boleh lebih dari hari ini" 
      });
    }

    // Check if already reported for this date
    const existingReport = await LaporanAbsen.findOne({ 
      userId, 
      tanggal: laporanDate,
      status: { $in: ["pending", "approved"] }
    });

    if (existingReport) {
      return res.status(400).json({ 
        message: "Anda sudah membuat laporan untuk tanggal ini" 
      });
    }

    let buktiUrl = null;

    // Upload bukti if provided
    if (req.file && req.file.buffer) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          let uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "absensi-laporan",
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
          
          setTimeout(() => {
            if (!uploadStream.destroyed) {
              uploadStream.destroy();
              reject(new Error('Upload timeout'));
            }
          }, 30000);
        });
        
        buktiUrl = uploadResult.secure_url;
        
      } catch (uploadErr) {
        console.error('Upload bukti error:', uploadErr);
        // Continue without bukti if upload fails
      }
    }

    // Create laporan
    const laporan = await LaporanAbsen.create({
      userId,
      tanggal: laporanDate,
      jenis,
      keterangan,
      bukti: buktiUrl,
      status: "pending",
    });

    return res.status(201).json({
      message: "Laporan berhasil dikirim!",
      data: laporan,
    });

  } catch (err) {
    console.error('laporAbsen error:', err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =========================
// GET LAPORAN USER LOGIN
// =========================
export const getLaporan = async (req, res) => {
  try {
    const userId = req.user.id;

    const laporan = await LaporanAbsen.find({ userId })
      .sort({ createdAt: -1 })
      .populate("respondedBy", "nama");

    return res.status(200).json({
      message: "Berhasil mengambil laporan",
      data: laporan,
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =========================
// GET ALL LAPORAN (ADMIN)
// =========================
export const getAllLaporan = async (req, res) => {
  try {
    const laporan = await LaporanAbsen.find()
      .sort({ createdAt: -1 })
      .populate("userId", "nama email kampus perusahaan")
      .populate("respondedBy", "nama");

    return res.status(200).json({
      message: "Berhasil mengambil semua laporan",
      data: laporan,
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =========================
// RESPOND LAPORAN (ADMIN)
// =========================
export const respondLaporan = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, responseNote } = req.body;
    const adminId = req.user.id;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const laporan = await LaporanAbsen.findById(id);
    if (!laporan) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }

    laporan.status = status;
    laporan.responseNote = responseNote || "";
    laporan.respondedBy = adminId;
    laporan.respondedAt = new Date();

    await laporan.save();

    const populated = await LaporanAbsen.findById(id)
      .populate("userId", "nama email")
      .populate("respondedBy", "nama");

    return res.status(200).json({
      message: `Laporan berhasil ${status === "approved" ? "disetujui" : "ditolak"}`,
      data: populated,
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
