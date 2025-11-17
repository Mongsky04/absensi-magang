// =========================
// PROFILE PAGE (EDIT FOTO)
// =========================
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserAPI from "../api/UserAPI";
import { setAuthToken } from "../api/axios";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [mentors, setMentors] = useState([]);
  const [form, setForm] = useState({ perusahaan: "", mentorId: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
    UserAPI.getProfile()
      .then(u => {
        setUser(u);
        setPreview(u.foto || "");
        setForm({ perusahaan: u.perusahaan || "", mentorId: (u.mentorId && u.mentorId._id) || u.mentorId || "" });
        // Ambil daftar mentor untuk dropdown (role apapun boleh lihat)
        return UserAPI.getMentors();
      })
      .then(m => setMentors(m))
      .catch(e => setError(e.message || "Gagal memuat profil"));
  }, []);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      // Hanya admin boleh ubah mentor/perusahaan; backend juga akan memvalidasi
      const payload = { foto: preview };
      if (user?.role === 'admin') {
        payload.perusahaan = form.perusahaan;
        payload.mentorId = form.mentorId || null;
      }
      const updated = await UserAPI.updateProfile(payload);
      setUser(updated);
      navigate("/");
    } catch (err) {
      setError(err.message || "Gagal menyimpan profil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto p-6">
  <h1 className="text-2xl font-bold mb-4">Profil</h1>
  {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

  <form onSubmit={onSave} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-4 mb-4">
            {preview ? (
              <img src={preview} alt="avatar" className="w-20 h-20 rounded-full object-cover border" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200" />
            )}
            <div>
              <div className="text-lg font-semibold">{user?.nama || "Memuat..."}</div>
              <div className="text-sm text-gray-600">{user?.email}</div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Ganti Foto Profil</label>
            <input type="file" accept="image/*" onChange={onFile} className="text-sm" />
          </div>

          {/* Perusahaan & Mentor (admin editable, non-admin read-only) */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Perusahaan</label>
            <input
              value={form.perusahaan}
              onChange={(e) => setForm(f => ({ ...f, perusahaan: e.target.value }))}
              className="border rounded px-3 py-2 w-full text-sm disabled:bg-gray-100"
              placeholder="Nama perusahaan"
              disabled={user?.role !== 'admin'}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Mentor</label>
            {user?.role === 'admin' ? (
              <select
                value={form.mentorId}
                onChange={(e) => setForm(f => ({ ...f, mentorId: e.target.value }))}
                className="border rounded px-3 py-2 w-full text-sm"
              >
                <option value="">— Pilih Mentor —</option>
                {mentors.map(m => (
                  <option key={m._id} value={m._id}>{m.nama}</option>
                ))}
              </select>
            ) : (
              <input
                value={user?.mentor || mentors.find(m => m._id === form.mentorId)?.nama || ""}
                readOnly
                className="border rounded px-3 py-2 w-full text-sm bg-gray-100"
              />
            )}
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan"}</button>
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
          </div>
        </form>
      </div>
    </div>
  );
}
