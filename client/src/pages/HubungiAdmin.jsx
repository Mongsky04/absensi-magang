// =========================
// HUBUNGI ADMIN PAGE
// =========================
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HubungiAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama: "",
    email: "",
    keperluan: "lupa-password",
    pesan: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Simulate sending message (you can implement actual email service later)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setForm({
        nama: "",
        email: "",
        keperluan: "lupa-password",
        pesan: "",
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-700 to-slate-800 p-12 flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white font-bold text-xl">
              J
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-[0.15em]">JASAMARGA</h1>
              <p className="text-xs text-teal-200 tracking-wider">JALANLAYANG CIKAMPEK</p>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Butuh Bantuan?<br />
            <span className="text-teal-200">Kami Siap Membantu</span>
          </h2>
          <p className="mt-6 text-teal-100 text-lg max-w-md">
            Hubungi admin untuk bantuan reset password atau pembuatan akun baru. Tim kami akan segera merespons permintaan Anda.
          </p>

          {/* Contact Info */}
          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3 text-teal-100">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-teal-200">Email</p>
                <p className="font-medium">admin@jasamarga.co.id</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-teal-100">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-teal-200">Telepon</p>
                <p className="font-medium">+62 21 1234 5678</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="text-teal-200 text-sm">
          © 2025 Jasamarga Jalanlayang Cikampek. All rights reserved.
        </div>
      </div>

      {/* Right Side - Contact Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              J
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-[0.15em]">JASAMARGA</h1>
              <p className="text-xs text-slate-500 tracking-wider">JALANLAYANG CIKAMPEK</p>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate("/login")}
            className="mb-4 inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Login
          </button>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Hubungi Admin</h2>
              <p className="text-slate-500 mt-2">Isi formulir di bawah untuk mendapatkan bantuan</p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Pesan berhasil dikirim! Admin akan segera menghubungi Anda.
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
              {/* Nama Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm(f => ({ ...f, nama: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="Nama lengkap Anda"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="email@example.com"
                  required
                />
              </div>

              {/* Keperluan Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Keperluan
                </label>
                <select
                  value={form.keperluan}
                  onChange={(e) => setForm(f => ({ ...f, keperluan: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition bg-white"
                  required
                >
                  <option value="lupa-password">Lupa Password</option>
                  <option value="akun-baru">Buat Akun Baru</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              {/* Pesan Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Pesan
                </label>
                <textarea
                  value={form.pesan}
                  onChange={(e) => setForm(f => ({ ...f, pesan: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
                  placeholder="Jelaskan keperluan Anda secara detail..."
                  rows={4}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 rounded-xl shadow-lg shadow-teal-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Kirim Pesan
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Mobile Footer */}
          <div className="lg:hidden mt-8 text-center text-sm text-slate-400">
            © 2025 Jasamarga Jalanlayang Cikampek
          </div>
        </div>
      </div>
    </div>
  );
}
