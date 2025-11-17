// =========================
// ADMIN PAGE: LIST & CREATE USERS
// =========================
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAPI from '../api/UserAPI';
import AuthAPI from '../api/AuthAPI';
import { setAuthToken } from '../api/axios';

export default function Admin() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'user',
    perusahaan: '',
    jabatan: '',
    isMentor: false,
    mentorId: '',
  });
  const [editId, setEditId] = useState(null);
  const editing = !!editId;

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) setAuthToken(token);
      // Ambil profil untuk cek role
      const profile = await UserAPI.getProfile();
      setCurrentUser(profile);
      if (profile.role !== 'admin') {
        navigate('/');
        return;
      }
      const [list, mList] = await Promise.all([
        UserAPI.getAllUsers(),
        UserAPI.getMentors(),
      ]);
      setUsers(list);
      setMentors(mList);
    } catch (err) {
      setError(err.message || err.error || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const resetForm = () => { setForm({ nama: '', email: '', password: '', role: 'user', perusahaan: '', jabatan: '', isMentor: false, mentorId: '' }); setEditId(null); };

  const submitCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      if (editing) {
        const payload = { ...form };
        if (!payload.password) delete payload.password; // avoid sending empty
        if (!payload.mentorId) payload.mentorId = null;
        const updated = await UserAPI.updateUserAdmin(editId, payload);
        setUsers(u => u.map(x => x._id === editId ? updated : x));
        resetForm();
      } else {
        const payload = { ...form };
        if (!payload.isMentor) delete payload.isMentor; // optional toggle
        if (!payload.mentorId) payload.mentorId = null;
        const newUser = await UserAPI.createUserAdmin(payload);
        setUsers(u => [...u, newUser]);
        resetForm();
      }
    } catch (err) {
      setError(err.message || err.error || 'Gagal membuat user');
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (u) => {
    setEditId(u._id);
    setForm({
      nama: u.nama || '',
      email: u.email || '',
      password: '', // blank so admin can choose to change
      role: u.role || 'user',
      perusahaan: u.perusahaan || '',
      jabatan: u.jabatan || '',
      isMentor: !!u.isMentor,
      mentorId: (u.mentorId && u.mentorId._id) || u.mentorId || '',
    });
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Hapus user ini?')) return;
    try {
      await UserAPI.deleteUserAdmin(id);
      setUsers(u => u.filter(x => x._id !== id));
      if (editId === id) resetForm();
    } catch (err) {
      setError(err.message || 'Gagal menghapus user');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin-only header, distinct from client Navbar */}
      <header className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Admin Panel — User Management</h1>
          <div className="flex items-center gap-4">
            <div className="text-xs opacity-80 hidden sm:block">{currentUser?.email}</div>
            <button
              onClick={() => { AuthAPI.logout(); navigate('/login'); }}
              className="text-sm bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        {loading ? (
          <div className="bg-white p-4 rounded shadow text-sm">Memuat...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Form Create User */}
            <div className="md:col-span-1 bg-white p-4 rounded shadow border border-slate-200">
              <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit User' : 'Buat User Baru'}</h2>
              <form onSubmit={submitCreate} className="space-y-3">
                <input required value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="Nama" className="border rounded px-3 py-2 w-full text-sm" />
                <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" className="border rounded px-3 py-2 w-full text-sm" />
                <input { ...(!editing ? { required: true } : {}) } type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder={editing ? 'Password (kosongkan jika tidak diubah)' : 'Password'} className="border rounded px-3 py-2 w-full text-sm" />
                <input value={form.perusahaan} onChange={e => setForm(f => ({ ...f, perusahaan: e.target.value }))} placeholder="Perusahaan" className="border rounded px-3 py-2 w-full text-sm" />
                <input value={form.jabatan} onChange={e => setForm(f => ({ ...f, jabatan: e.target.value }))} placeholder="Jabatan" className="border rounded px-3 py-2 w-full text-sm" />
                <div className="flex items-center gap-2 text-sm">
                  <label className="font-medium">Role:</label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="border rounded px-2 py-1 text-sm">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <input id="isMentor" type="checkbox" checked={form.isMentor} onChange={e => setForm(f => ({ ...f, isMentor: e.target.checked }))} />
                  <label htmlFor="isMentor">Jadikan Mentor</label>
                </div>
                {/* Mentor assignment for participant */}
                {!form.isMentor && (
                  <select value={form.mentorId} onChange={e => setForm(f => ({ ...f, mentorId: e.target.value }))} className="border rounded px-3 py-2 w-full text-sm">
                    <option value="">— Pilih Mentor —</option>
                    {mentors.map(m => <option key={m._id} value={m._id}>{m.nama}</option>)}
                  </select>
                )}
                <div className="flex gap-2">
                  <button disabled={creating} className="flex-1 bg-blue-600 text-white rounded py-2 text-sm disabled:opacity-50">
                    {creating ? (editing ? 'Menyimpan...' : 'Membuat...') : (editing ? 'Simpan Perubahan' : 'Buat User')}
                  </button>
                  {editing && (
                    <button type="button" onClick={resetForm} className="px-3 py-2 bg-gray-200 rounded text-sm">Batal</button>
                  )}
                </div>
              </form>
            </div>
            {/* Users List */}
            <div className="md:col-span-2 bg-white p-4 rounded shadow overflow-auto border border-slate-200">
              <h2 className="text-lg font-semibold mb-4">Daftar User</h2>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-3 py-2">Nama</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Role</th>
                    <th className="px-3 py-2">Perusahaan</th>
                    <th className="px-3 py-2">Mentor</th>
                    <th className="px-3 py-2">isMentor</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-t hover:bg-blue-50">
                      <td className="px-3 py-2">
                        <button type="button" onClick={() => startEdit(u)} className="text-blue-600 hover:underline">
                          {u.nama}
                        </button>
                      </td>
                      <td className="px-3 py-2">{u.email}</td>
                      <td className="px-3 py-2">{u.role}</td>
                      <td className="px-3 py-2">{u.perusahaan || '-'}</td>
                      <td className="px-3 py-2">{u.mentor || (u.mentorId?.nama) || '-'}</td>
                      <td className="px-3 py-2">{u.isMentor ? 'Ya' : 'Tidak'}</td>
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => deleteUser(u._id)} className="text-red-600 text-xs hover:underline">Hapus</button>
                      </td>
                    </tr>
                  ))}
                  {!users.length && (
                    <tr>
                      <td colSpan={7} className="px-3 py-6 text-center text-gray-500">Tidak ada user</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}