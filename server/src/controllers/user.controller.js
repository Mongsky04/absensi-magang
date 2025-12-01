import User from "../models/User.js";
import bcrypt from "bcryptjs";

// =========================
// GET PROFILE (USER LOGIN)
// =========================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate({ path: 'mentorId', select: 'nama email' });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan!" });
    }

    // Tambahkan nama mentor dari relasi jika ada
    const data = user.toObject();
    if (data.mentorId && !data.mentor) {
      data.mentor = data.mentorId.nama;
    }

    return res.status(200).json({
      message: "Berhasil mengambil data profil",
      data,
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =========================
// UPDATE PROFILE (FOTO SAJA SEMENTARA)
// =========================
export const updateProfile = async (req, res) => {
  try {
    const { foto, perusahaan, mentor, mentorId, jabatan, kampus } = req.body; // metadata profil
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan!" });
    }
    if (typeof foto === 'string') user.foto = foto;
    if (typeof jabatan === 'string') user.jabatan = jabatan;

    // Hanya admin boleh mengubah perusahaan & mentor
    const isAdmin = req.user.role === 'admin';
    if (isAdmin) {
      if (typeof perusahaan === 'string') user.perusahaan = perusahaan;
      if (typeof mentor === 'string') user.mentor = mentor;
      if (mentorId !== undefined) user.mentorId = mentorId || null;
      if (typeof kampus === 'string') user.kampus = kampus;
    }
    await user.save();
    return res.status(200).json({
      message: "Profile berhasil diperbarui",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =========================
// GET ALL USERS (ADMIN)
// =========================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").populate({ path: 'mentorId', select: 'nama email' });
    const mapped = users.map(u => {
      const obj = u.toObject();
      if (obj.mentorId && !obj.mentor) obj.mentor = obj.mentorId.nama;
      return obj;
    });
    return res.status(200).json({
      message: "Berhasil mengambil semua data user",
      data: mapped,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =========================
// CREATE USER (ADMIN ONLY)
// =========================
export const createUserAdmin = async (req, res) => {
  try {
    const { nama, email, password, role, perusahaan, jabatan, kampus, isMentor, mentorId, mentor } = req.body;
    if (!nama || !email || !password) return res.status(400).json({ message: 'Nama, email, password wajib diisi' });
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: 'Email sudah terdaftar' });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    
    // Get mentor name if mentorId is provided
    let mentorName = mentor || '';
    if (mentorId) {
      const mentorUser = await User.findById(mentorId).select('nama');
      if (mentorUser) {
        mentorName = mentorUser.nama;
      }
    }
    
    const newUser = await User.create({
      nama,
      email,
      password: hashed,
      role: role || 'user',
      perusahaan: perusahaan || '',
      jabatan: jabatan || '',
      kampus: kampus || '',
      isMentor: !!isMentor,
      mentorId: mentorId || null,
      mentor: mentorName,
    });
    
    // Populate mentor data untuk response
    const populated = await User.findById(newUser._id).select('-password').populate({ path: 'mentorId', select: 'nama email' });
    const result = populated.toObject();
    if (result.mentorId && !result.mentor) {
      result.mentor = result.mentorId.nama;
    }
    
    return res.status(201).json({ message: 'User berhasil dibuat', data: result });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// =========================
// UPDATE USER (ADMIN ONLY)
// =========================
export const updateUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, email, password, role, perusahaan, jabatan, kampus, isMentor, mentorId, mentor, foto } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    if (nama !== undefined) user.nama = nama;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;
    if (perusahaan !== undefined) user.perusahaan = perusahaan;
    if (jabatan !== undefined) user.jabatan = jabatan;
    if (kampus !== undefined) user.kampus = kampus;
    if (typeof isMentor === 'boolean') user.isMentor = isMentor;
    if (mentorId !== undefined) {
      user.mentorId = mentorId || null;
      // Update mentor name from mentorId
      if (mentorId) {
        const mentorUser = await User.findById(mentorId).select('nama');
        if (mentorUser) {
          user.mentor = mentorUser.nama;
        }
      } else {
        user.mentor = '';
      }
    }
    if (mentor !== undefined) user.mentor = mentor;
    if (foto !== undefined) user.foto = foto;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    await user.save();
    
    // Populate mentor data untuk response
    const populated = await User.findById(id).select('-password').populate({ path: 'mentorId', select: 'nama email' });
    const sanitized = populated.toObject();
    if (sanitized.mentorId && !sanitized.mentor) {
      sanitized.mentor = sanitized.mentorId.nama;
    }
    
    return res.status(200).json({ message: 'User berhasil diupdate', data: sanitized });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// =========================
// DELETE USER (ADMIN ONLY)
// =========================
export const deleteUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    await User.deleteOne({ _id: id });
    return res.status(200).json({ message: 'User dihapus' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
