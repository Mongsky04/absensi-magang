import mongoose from "mongoose";

// =========================
// LAPORAN ABSEN MODEL
// =========================
const LaporanAbsenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tanggal: {
      type: Date,
      required: true,
    },
    jenis: {
      type: String,
      enum: ["izin", "sakit", "lupa"],
      required: true,
    },
    keterangan: {
      type: String,
      required: true,
      trim: true,
    },
    bukti: {
      type: String, // URL file hasil upload Cloudinary
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    respondedAt: {
      type: Date,
      default: null,
    },
    responseNote: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("LaporanAbsen", LaporanAbsenSchema);
