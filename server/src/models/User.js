import mongoose from "mongoose";

// =========================
// USER MODEL
// =========================
const UserSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    jabatan: {
      type: String,
      default: "",
      trim: true,
    },
    foto: {
      type: String, // URL atau data URI base64
      default: null,
    },
    perusahaan: {
      type: String,
      default: "",
      trim: true,
    },
    mentor: {
      type: String,
      default: "",
      trim: true,
    },
    kampus: {
      type: String,
      default: "",
      trim: true,
    },
    isMentor: {
      type: Boolean,
      default: false,
    },
    // Relasi ke user Mentor (jika digunakan relasi)
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
