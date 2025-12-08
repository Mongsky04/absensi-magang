import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

// =========================
// REGISTER
// =========================
export const register = async (req, res) => {
  try {
  const { nama, email, password, role, perusahaan, mentor, jabatan, isMentor, mentorId } = req.body;

    // cek email sudah ada atau belum
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // simpan user baru
    const newUser = await User.create({
      nama,
      email,
      password: hashedPassword,
      role: role || "user",
      perusahaan: perusahaan || "",
      mentor: mentor || "",
      jabatan: jabatan || "",
      isMentor: Boolean(isMentor) || false,
      mentorId: mentorId || null,
    });

    // Generate token untuk langsung login setelah register
    const token = generateToken({
      id: newUser._id,
      role: newUser.role,
      nama: newUser.nama,
    });

    return res.status(201).json({
      message: "Registrasi berhasil",
      token,
      data: newUser,
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =========================
// LOGIN
// =========================
export const login = async (req, res) => {
  try {
  const { email, password } = req.body;

    // cek user ada atau tidak
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email tidak ditemukan!" });
    }

    // cek password benar atau tidak
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah!" });
    }

    // generate token JWT menggunakan utils
    const token = generateToken({
      id: user._id,
      role: user.role,
      nama: user.nama,
    });

    return res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user._id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        perusahaan: user.perusahaan,
        mentor: user.mentor,
        mentorId: user.mentorId,
        isMentor: user.isMentor,
        foto: user.foto,
        jabatan: user.jabatan,
      }
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
