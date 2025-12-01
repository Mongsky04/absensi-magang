// =========================
// LAPOR ABSEN PAGE
// =========================
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserAPI from "../api/UserAPI";
import AbsensiAPI from "../api/AbsensiApi";
import { setAuthToken } from "../api/axios";

export default function LaporAbsen() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error

  const [formData, setFormData] = useState({
    tanggal: "",
    jenis: "izin", // izin, sakit, lupa
    keterangan: "",
    bukti: null,
  });

  useEffect(() => {
    // Ensure token is set before loading user
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setAuthToken(token);
    loadUser();
  }, [navigate]);

  const loadUser = async () => {
    try {
      setPageLoading(true);
      const res = await UserAPI.getProfile();
      setUser(res.data);
    } catch (err) {
      console.error("Failed to load user:", err);
      // If token is invalid, redirect to login
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setMessage("File harus berupa gambar");
        setMessageType("error");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Ukuran file maksimal 5MB");
        setMessageType("error");
        return;
      }
      setFormData((prev) => ({ ...prev, bukti: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    // Validation
    if (!formData.tanggal) {
      setMessage("Tanggal harus diisi");
      setMessageType("error");
      return;
    }

    if (!formData.keterangan.trim()) {
      setMessage("Keterangan harus diisi");
      setMessageType("error");
      return;
    }

    if (formData.jenis === "sakit" && !formData.bukti) {
      setMessage("Untuk sakit, harap upload surat keterangan dokter");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("tanggal", formData.tanggal);
      payload.append("jenis", formData.jenis);
      payload.append("keterangan", formData.keterangan);
      if (formData.bukti) {
        payload.append("bukti", formData.bukti);
      }

      await AbsensiAPI.laporAbsen(payload);

      setMessage("Laporan berhasil dikirim! Tunggu konfirmasi dari mentor.");
      setMessageType("success");

      // Reset form
      setFormData({
        tanggal: "",
        jenis: "izin",
        keterangan: "",
        bukti: null,
      });

      // Clear file input
      const fileInput = document.getElementById("bukti");
      if (fileInput) fileInput.value = "";

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } catch (err) {
      console.error("Lapor absen error:", err);
      setMessage(err.response?.data?.message || "Gagal mengirim laporan");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-teal-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat halaman...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 via-purple-50 to-pink-50">
      <Navbar user={user} />

      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-teal-600 to-teal-500 p-4 sm:p-6 text-white">
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Lapor Ketidakhadiran
            </h1>
            <p className="text-teal-100 text-sm mt-2">
              Laporkan jika Anda izin, sakit, atau lupa melakukan absen
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            {/* Message */}
            {message && (
              <div
                className={`p-4 rounded-lg border ${
                  messageType === "success"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  {messageType === "success" ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-sm font-medium">{message}</span>
                </div>
              </div>
            )}

            {/* Tanggal */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tanggal <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">Pilih tanggal ketidakhadiran</p>
            </div>

            {/* Jenis */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Jenis Laporan <span className="text-red-500">*</span>
              </label>
              <select
                name="jenis"
                value={formData.jenis}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="izin">Izin</option>
                <option value="sakit">Sakit</option>
                <option value="lupa">Lupa Absen</option>
              </select>
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Keterangan <span className="text-red-500">*</span>
              </label>
              <textarea
                name="keterangan"
                value={formData.keterangan}
                onChange={handleChange}
                rows={4}
                required
                placeholder="Jelaskan alasan ketidakhadiran atau lupa absen..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              ></textarea>
              <p className="text-xs text-slate-500 mt-1">
                Berikan penjelasan yang jelas dan detail
              </p>
            </div>

            {/* Bukti (optional for izin/lupa, required for sakit) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Upload Bukti {formData.jenis === "sakit" && <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                id="bukti"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
              <p className="text-xs text-slate-500 mt-1">
                {formData.jenis === "sakit"
                  ? "Wajib: Surat keterangan dokter (foto/scan)"
                  : "Opsional: Screenshot, foto, atau dokumen pendukung (max 5MB)"}
              </p>
              {formData.bukti && (
                <p className="text-xs text-green-600 mt-2 font-medium">
                  ✓ File terpilih: {formData.bukti.name}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-linear-to-r from-teal-600 to-teal-500 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Kirim Laporan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Informasi:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Laporan akan ditinjau oleh mentor Anda</li>
                <li>Untuk sakit, wajib melampirkan surat dokter</li>
                <li>Pastikan tanggal dan keterangan sudah benar</li>
                <li>Anda akan mendapat notifikasi setelah laporan disetujui</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
