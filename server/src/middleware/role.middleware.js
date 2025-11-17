// =========================
// ROLE CHECK (ADMIN ONLY)
// =========================
export const adminOnly = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Akses ditolak, hanya admin!" });
    }

    next();

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
