// =========================
// ADMIN PAGE MAGENTA STYLE
// =========================
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserAPI from "../api/UserAPI";
import AbsensiAPI from "../api/AbsensiApi";
import AuthAPI from "../api/AuthAPI";
import { setAuthToken } from "../api/axios";
import Navbar from "../components/Navbar";

export default function Admin() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("users"); // users | laporan
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    role: "user",
    perusahaan: "PT Jasamarga Jalanlayang Cikampek",
    jabatan: "",
    kampus: "",
    isMentor: false,
    mentorId: "",
  });
  const [editId, setEditId] = useState(null);
  const editing = !!editId;

  const loadData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) setAuthToken(token);
      
      const profile = await UserAPI.getProfile();
      setCurrentUser(profile);
      
      if (profile.role !== "admin") {
        navigate("/");
        return;
      }
      
      const [list, mList, laporanList] = await Promise.all([
        UserAPI.getAllUsers(),
        UserAPI.getMentors(),
        AbsensiAPI.getAllLaporan(),
      ]);
      setUsers(list);
      setMentors(mList);
      setLaporan(laporanList);
    } catch (err) {
      setError(err.message || err.error || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({
      nama: "",
      email: "",
      password: "",
      role: "user",
      perusahaan: "PT Jasamarga Jalanlayang Cikampek",
      jabatan: "",
      kampus: "",
      isMentor: false,
      mentorId: "",
    });
    setEditId(null);
    setShowForm(false);
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");
    
    try {
      if (editing) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        if (!payload.mentorId) payload.mentorId = null;
        const updated = await UserAPI.updateUserAdmin(editId, payload);
        setUsers(u => u.map(x => x._id === editId ? updated : x));
        setSuccess("User berhasil diupdate!");
        resetForm();
      } else {
        const payload = { ...form };
        if (!payload.isMentor) delete payload.isMentor;
        if (!payload.mentorId) payload.mentorId = null;
        const newUser = await UserAPI.createUserAdmin(payload);
        setUsers(u => [...u, newUser]);
        setSuccess("User baru berhasil dibuat!");
        resetForm();
      }
    } catch (err) {
      setError(err.message || err.error || "Gagal menyimpan user");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (u) => {
    setEditId(u._id);
    setForm({
      nama: u.nama || "",
      email: u.email || "",
      password: "",
      role: u.role || "user",
      perusahaan: "PT Jasamarga Jalanlayang Cikampek",
      jabatan: u.jabatan || "",
      kampus: u.kampus || "",
      isMentor: !!u.isMentor,
      mentorId: (u.mentorId && u.mentorId._id) || u.mentorId || "",
    });
    setShowForm(true);
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;
    try {
      await UserAPI.deleteUserAdmin(id);
      setUsers(u => u.filter(x => x._id !== id));
      setSuccess("User berhasil dihapus");
      if (editId === id) resetForm();
    } catch (err) {
      setError(err.message || "Gagal menghapus user");
    }
  };

  const handleRespondLaporan = async (laporanId, status, responseNote = "") => {
    try {
      setError("");
      setSuccess("");
      const updated = await AbsensiAPI.respondLaporan(laporanId, { status, responseNote });
      setLaporan(prev => prev.map(l => l._id === laporanId ? updated : l));
      setSuccess(`Laporan berhasil ${status === "approved" ? "disetujui" : "ditolak"}!`);
    } catch (err) {
      setError(err.message || "Gagal merespon laporan");
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", { 
      year: "numeric", 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const pendingCount = laporan.filter(l => l.status === "pending").length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={currentUser} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Panel</h1>
            <p className="text-slate-500">Kelola pengguna dan laporan sistem absensi</p>
          </div>
          {activeTab === "users" && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg font-medium transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah User
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2.5 font-medium transition relative ${
              activeTab === "users"
                ? "text-teal-600 border-b-2 border-teal-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            Daftar User
          </button>
          <button
            onClick={() => setActiveTab("laporan")}
            className={`px-4 py-2.5 font-medium transition relative ${
              activeTab === "laporan"
                ? "text-teal-600 border-b-2 border-teal-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            Laporan Absen
            {pendingCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
            <button onClick={() => setError("")} className="ml-auto">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {success}
            <button onClick={() => setSuccess("")} className="ml-auto">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : activeTab === "laporan" ? (
          // Laporan Tab Content
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Laporan Ketidakhadiran ({laporan.length})</h2>
              <p className="text-sm text-slate-500 mt-1">Review dan approve laporan izin, sakit, atau lupa absen dari peserta magang</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Peserta</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Tanggal</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Jenis</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Keterangan</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Bukti</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {laporan.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        Belum ada laporan
                      </td>
                    </tr>
                  ) : (
                    laporan.map(item => (
                      <tr key={item._id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-slate-800">{item.userId?.nama || "-"}</p>
                            <p className="text-xs text-slate-500">{item.userId?.email || "-"}</p>
                            {item.userId?.kampus && (
                              <p className="text-xs text-slate-400">{item.userId.kampus}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-slate-800">{formatDate(item.tanggal)}</p>
                            <p className="text-xs text-slate-500">Lapor: {formatDateTime(item.createdAt)}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                            item.jenis === "izin" 
                              ? "bg-blue-100 text-blue-800"
                              : item.jenis === "sakit"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-orange-100 text-orange-800"
                          }`}>
                            {item.jenis === "izin" ? "Izin" : item.jenis === "sakit" ? "Sakit" : "Lupa Absen"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="max-w-xs">
                            <p className="text-sm text-slate-700 line-clamp-2">{item.keterangan}</p>
                            {item.responseNote && (
                              <p className="text-xs text-slate-500 italic mt-1">Catatan: {item.responseNote}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {item.bukti ? (
                            <a
                              href={item.bukti}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-600 hover:text-teal-700 hover:underline inline-flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Lihat
                            </a>
                          ) : (
                            <span className="text-slate-400 text-xs">Tidak ada</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                            item.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : item.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {item.status === "pending" ? "Pending" : item.status === "approved" ? "Disetujui" : "Ditolak"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {item.status === "pending" ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  const note = prompt("Catatan (opsional):");
                                  if (note !== null) handleRespondLaporan(item._id, "approved", note);
                                }}
                                className="p-2 hover:bg-green-50 rounded-lg transition"
                                title="Setujui"
                              >
                                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  const note = prompt("Alasan penolakan:");
                                  if (note) handleRespondLaporan(item._id, "rejected", note);
                                }}
                                className="p-2 hover:bg-red-50 rounded-lg transition"
                                title="Tolak"
                              >
                                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <div className="text-center text-xs text-slate-400">
                              {item.respondedBy?.nama || "Admin"}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Form Panel */}
            {showForm && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-semibold text-slate-800">
                      {editing ? "Edit User" : "Tambah User Baru"}
                    </h2>
                    <button onClick={resetForm} className="p-1 hover:bg-slate-100 rounded">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <form onSubmit={submitCreate} className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nama *</label>
                      <input
                        required
                        value={form.nama}
                        onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
                        placeholder="Nama lengkap"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="email@example.com"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Password {editing ? "(kosongkan jika tidak diubah)" : "*"}
                      </label>
                      <input
                        type="password"
                        required={!editing}
                        value={form.password}
                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                        <select
                          value={form.role}
                          onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Jabatan</label>
                        <input
                          value={form.jabatan}
                          onChange={e => setForm(f => ({ ...f, jabatan: e.target.value }))}
                          placeholder="Jabatan"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Perusahaan</label>
                      <input
                        value={form.perusahaan}
                        disabled
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Kampus</label>
                      <input
                        value={form.kampus}
                        onChange={e => setForm(f => ({ ...f, kampus: e.target.value }))}
                        placeholder='Contoh: Universitas Pembangunan Nasional "Veteran" Jakarta'
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input
                        id="isMentor"
                        type="checkbox"
                        checked={form.isMentor}
                        onChange={e => setForm(f => ({ ...f, isMentor: e.target.checked, mentorId: e.target.checked ? "" : f.mentorId }))}
                        className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <label htmlFor="isMentor" className="text-sm text-slate-700">Jadikan sebagai Mentor</label>
                    </div>
                    
                    {!form.isMentor && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Mentor</label>
                        <select
                          value={form.mentorId}
                          onChange={e => setForm(f => ({ ...f, mentorId: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="">— Tanpa Mentor —</option>
                          {mentors.map(m => (
                            <option key={m._id} value={m._id}>{m.nama}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={creating}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {creating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {editing ? "Menyimpan..." : "Membuat..."}
                          </>
                        ) : (
                          editing ? "Simpan Perubahan" : "Buat User"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Users Table */}
            <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h2 className="font-semibold text-slate-800">Daftar User ({users.length})</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">User</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Perusahaan</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Kampus</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Mentor</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                            Belum ada user
                          </td>
                        </tr>
                      ) : (
                        users.map(u => (
                          <tr key={u._id} className="hover:bg-slate-50 transition">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {u.foto ? (
                                  <img src={u.foto} alt={u.nama} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold">
                                    {u.nama?.charAt(0) || "U"}
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-slate-800">{u.nama}</p>
                                  <p className="text-xs text-slate-500">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                                u.role === "admin" 
                                  ? "bg-purple-100 text-purple-700" 
                                  : "bg-slate-100 text-slate-600"
                              }`}>
                                {u.role === "admin" ? "Admin" : "User"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">{u.perusahaan || "-"}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{u.kampus || "-"}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{u.mentor || u.mentorId?.nama || "-"}</td>
                            <td className="px-4 py-3">
                              {u.isMentor && (
                                <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-teal-100 text-teal-700">
                                  Mentor
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => startEdit(u)}
                                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                                  title="Edit"
                                >
                                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => deleteUser(u._id)}
                                  className="p-2 hover:bg-red-50 rounded-lg transition"
                                  title="Hapus"
                                >
                                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
