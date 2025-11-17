const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const moment = require("moment");
const connectDB = require("../src/config/db");
const User = require("../src/models/User");
const Absensi = require("../src/models/Absensi");
const { generateToken } = require("../src/utils/jwt");

(async () => {
  try {
    await connectDB();

  const email = process.env.SEED_EMAIL || "zaky@example.com";
  const password = process.env.SEED_PASSWORD || "password123";
  const mentorEmail = process.env.SEED_MENTOR_EMAIL || "imam.mentor@example.com";
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";

    // Create a mentor account
    let mentorUser = await User.findOne({ email: mentorEmail });
    if (!mentorUser) {
      const hashedM = await bcrypt.hash(password, 10);
      mentorUser = await User.create({
        nama: "Imam Syafinullah",
        email: mentorEmail,
        password: hashedM,
        role: "user",
        isMentor: true,
        jabatan: "Mentor",
        perusahaan: "PT Jasamarga Jalanlayang Cikampek",
      });
      console.log("✅ Mentor created:", mentorUser.email);
    }

    // Create an admin account
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      const hashedA = await bcrypt.hash(password, 10);
      adminUser = await User.create({
        nama: "Admin",
        email: adminEmail,
        password: hashedA,
        role: "admin",
        jabatan: "Admin",
      });
      console.log("✅ Admin created:", adminUser.email);
    }

    let user = await User.findOne({ email });
  if (!user) {
      const hashed = await bcrypt.hash(password, 10);
      user = await User.create({
        nama: "MUHAMAD ZAKY RAMADHAN",
        email,
        password: hashed,
        role: "user",
        jabatan: "Peserta Magang",
        perusahaan: "PT Jasamarga Jalanlayang Cikampek",
  mentor: "Imam Syafinullah",
  mentorId: mentorUser._id,
        foto: "",
      });
      console.log("✅ User created:", user.email);
    } else {
      console.log("ℹ️ User exists:", user.email);
      // Pastikan field baru terisi
      const update = {};
      if (!user.perusahaan) update.perusahaan = "PT Jasamarga Jalanlayang Cikampek";
      if (!user.mentor) update.mentor = "Imam Syafinullah";
      if (Object.keys(update).length) {
        await User.updateOne({ _id: user._id }, { $set: update });
        console.log("🔄 User updated with new fields");
      }
    }

    const dates = [
      moment().subtract(4, "days"),
      moment().subtract(3, "days"),
      moment().subtract(2, "days"),
      moment().subtract(1, "days"),
      moment(),
    ];

    for (const d of dates) {
      const tanggal = d.startOf("day").toDate();
      let absen = await Absensi.findOne({ userId: user._id, tanggal });
      if (!absen) {
        const jamMasuk = d.clone().hour(8).minute(55).toDate();
        const jamPulang = d.clone().hour(17).minute(5).toDate();
        const status = d.day() === moment().day() && d.hour() > 9 ? "telat" : "hadir";
        absen = await Absensi.create({
          userId: user._id,
          tanggal,
          jamMasuk,
          jamPulang,
          status,
        });
        console.log("➕ Absen created:", tanggal.toISOString().slice(0,10));
      }
    }

    const token = generateToken({ id: user._id, role: user.role, nama: user.nama });
    console.log("\n==============================");
    console.log("Login Token (use for testing):\n");
    console.log(token);
    console.log("\nSet this in client localStorage or open with ?token=... query.");
    console.log("==============================\n");

  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
})();
