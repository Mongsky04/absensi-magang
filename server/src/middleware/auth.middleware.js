import { verifyToken } from "../utils/jwt.js";

// =========================
// AUTH MIDDLEWARE (JWT CHECK)
// =========================
export default (req, res, next) => {
  try {
    const header = req.headers.authorization;

    // cek apakah ada token
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Akses ditolak, token tidak ditemukan!" });
    }

    const token = header.split(" ")[1];

    // verifikasi token lewat utils
    const decoded = verifyToken(token);

    // simpan data user dari token
    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid!", error: err.message });
  }
};
