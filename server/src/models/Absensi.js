import mongoose from "mongoose";

// =========================
// ABSENSI MODEL
// =========================
const AbsensiSchema = new mongoose.Schema(
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
    jamMasuk: {
      type: Date,
      default: null,
    },
    jamPulang: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["hadir", "telat", "izin", "sakit"],
      default: "hadir",
    },
    keterangan: {
      type: String,
      default: "",
      trim: true,
    },
    foto: {
      type: String, // URL file hasil upload Cloudinary
      default: null,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Absensi", AbsensiSchema);
