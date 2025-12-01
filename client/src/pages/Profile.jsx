// =========================
// PROFILE PAGE MAGENTA STYLE
// =========================
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserAPI from "../api/UserAPI";
import { setAuthToken } from "../api/axios";
import Navbar from "../components/Navbar";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mentors, setMentors] = useState([]);
  const [form, setForm] = useState({ perusahaan: "", mentorId: "", kampus: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
    
    UserAPI.getProfile()
      .then(u => {
        setUser(u);
        setPreview(u.foto || "");
        setForm({ 
          perusahaan: u.perusahaan || "", 
          mentorId: (u.mentorId && u.mentorId._id) || u.mentorId || "",
          kampus: u.kampus || ""
        });
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
    setSuccess("");
    
    try {
      const payload = { foto: preview };
      // Only admin can edit magang fields, which is done through admin panel
      // User cannot edit perusahaan, mentorId, or kampus
      
      const updated = await UserAPI.updateProfile(payload);
      setUser(updated);
      setSuccess("Profil berhasil disimpan!");
      setTimeout(() => navigate(user?.role === "admin" ? "/admin" : "/"), 1500);
    } catch (err) {
      setError(err.message || "Gagal menyimpan profil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 transition mb-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Edit Profil</h1>
          <p className="text-slate-500 mt-1">Kelola informasi profil Anda</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={onSave} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Profile Photo Section */}
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-4">Foto Profil</h3>
            <div className="flex items-center gap-6">
              {/* Avatar Preview */}
              <div className="relative group">
                {preview ? (
                  <img 
                    src={preview} 
                    alt="Avatar" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-slate-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-3xl font-bold border-4 border-slate-100">
                    {user?.nama?.charAt(0) || "U"}
                  </div>
                )}
                <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input type="file" accept="image/*" onChange={onFile} className="hidden" />
                </label>
              </div>
              
              {/* Upload Instructions */}
              <div>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 cursor-pointer transition">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Foto
                  <input type="file" accept="image/*" onChange={onFile} className="hidden" />
                </label>
                <p className="text-xs text-slate-400 mt-2">JPG, PNG atau GIF. Maks 2MB.</p>
              </div>
            </div>
          </div>

          {/* Basic Info Section */}
          <div className="p-4 sm:p-6 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-3 sm:mb-4">Informasi Dasar</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={user?.nama || ""}
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <input
                  type="text"
                  value={user?.role === "admin" ? "Administrator" : "Peserta Magang"}
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Company & Mentor Section - Only for User/Pemagang */}
          {user?.role !== "admin" && (
            <div className="p-4 sm:p-6 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-3 sm:mb-4">Informasi Magang</h3>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Perusahaan</label>
                  <input
                    type="text"
                    value={form.perusahaan}
                    disabled
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mentor</label>
                  <input
                    type="text"
                    value={user?.mentor || mentors.find(m => m._id === form.mentorId)?.nama || "-"}
                    disabled
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kampus</label>
                  <input
                    type="text"
                    value={form.kampus}
                    disabled
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3 italic">
                * Informasi magang hanya dapat diubah oleh admin
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="p-6 bg-slate-50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg font-medium text-slate-700 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
