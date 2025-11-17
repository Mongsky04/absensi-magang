// =========================
// DASHBOARD PAGE + NAVBAR
// =========================
import React, { useEffect, useState, useMemo } from "react";

import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import PresensiBox from "../components/PresensiBox";
import KehadiranTable from "../components/KehadiranTable";
import KehadiranSummary from "../components/KehadiranSummary";

import AbsensiAPI from "../api/AbsensiApi";
import UserAPI from "../api/UserAPI";
import { setAuthToken } from "../api/axios";

export default function Dashboard() {
  // ✅ Dummy user agar ProfileCard & Navbar muncul
  const [user, setUser] = useState(null);
  const [absensiRaw, setAbsensiRaw] = useState([]); // raw data dari server (belum diisi placeholder)
  const [riwayat, setRiwayat] = useState([]);      // data tampilan bulan terpilih (sudah termasuk placeholder)
  const [summary, setSummary] = useState([]);      // ringkasan untuk bulan terpilih saja
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dropdown bulan & tahun
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // 1..12
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const monthNames = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember"
  ];

  // Helper umum
  const pad = (n) => (n < 10 ? "0" + n : String(n));

  // Bentuk row tampilan dari satu dokumen absensi
  const toDisplayRow = (a) => {
    const fmtTime = (d) => {
      if (!d) return "-";
      const dt = new Date(d);
      return pad(dt.getHours()) + ":" + pad(dt.getMinutes());
    };
    const fmtDate = (d) => {
      // Format tanggal sebagai lokal (bukan UTC) agar tidak bergeser hari
      const dt = new Date(d);
      return dt.getFullYear() + "-" + pad(dt.getMonth() + 1) + "-" + pad(dt.getDate());
    };
    const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "-");
    return {
      tanggal: fmtDate(a.tanggal),
      checkIn: fmtTime(a.jamMasuk),
      checkOut: fmtTime(a.jamPulang),
      status: cap(a.status),
      keterangan: a.keterangan || "-",
      foto: a.foto || null,
    };
  };

  // Bangun full month rows (placeholder + data asli bulan terpilih)
  const buildMonthRows = (raw, year, month) => {
    const monthKey = year + "-" + pad(month); // YYYY-MM
    const daysInMonth = new Date(year, month, 0).getDate();
    const mapTanggal = new Map(
      raw
        .filter(r => {
          const dt = new Date(r.tanggal);
          return dt.getFullYear() === year && (dt.getMonth() + 1) === month;
        })
        .map(r => {
          const dStr = new Date(r.tanggal).toISOString().slice(0,10);
          return [dStr, toDisplayRow(r)];
        })
    );
    const rows = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${pad(month)}-${pad(d)}`;
      if (mapTanggal.has(dateStr)) rows.push(mapTanggal.get(dateStr));
      else rows.push({
        tanggal: dateStr,
        checkIn: "-",
        checkOut: "-",
        status: "-",
        keterangan: "-",
        foto: null,
      });
    }
    return rows;
  };

  // Ringkasan hanya untuk bulan terpilih
  const computeMonthSummary = (raw, year, month) => {
    let hadir = 0;
    let tidakHadir = 0;
    raw.forEach(item => {
      const dt = new Date(item.tanggal);
      if (dt.getFullYear() !== year || (dt.getMonth() + 1) !== month) return;
      if (item.status === "hadir" || item.status === "telat") hadir += 1;
      else tidakHadir += 1;
    });
    const monthKey = year + "-" + pad(month);
    const label = monthNames[month - 1] + " " + year;
    return [{ no: 1, bulan: label, monthKey, hadir, tidakHadir }];
  };

  // Hitung daftar tahun dari data untuk dropdown (memoized)
  const yearsOptions = useMemo(() => {
    const set = new Set(absensiRaw.map(a => new Date(a.tanggal).getFullYear()));
    set.add(now.getFullYear()); // pastikan tahun sekarang ada
    return Array.from(set.values()).sort((a,b) => a - b);
  }, [absensiRaw]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
    const load = async () => {
      try {
        const [profile, absensi] = await Promise.all([
          UserAPI.getProfile(),
          AbsensiAPI.getRiwayat(),
        ]);
        setUser(profile);
        setAbsensiRaw(absensi);
        // Inisialisasi tampilan bulan sekarang
        setRiwayat(buildMonthRows(absensi, selectedYear, selectedMonth));
        setSummary(computeMonthSummary(absensi, selectedYear, selectedMonth));
      } catch (err) {
        setError(err.message || err.error || "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recompute tiap kali bulan/tahun berubah atau raw data diperbarui
  useEffect(() => {
    if (!absensiRaw || absensiRaw.length === 0) {
      // tetap buat placeholder full month walau kosong
      setRiwayat(buildMonthRows([], selectedYear, selectedMonth));
      setSummary(computeMonthSummary([], selectedYear, selectedMonth));
      return;
    }
    setRiwayat(buildMonthRows(absensiRaw, selectedYear, selectedMonth));
    setSummary(computeMonthSummary(absensiRaw, selectedYear, selectedMonth));
  }, [absensiRaw, selectedMonth, selectedYear]);

  // Data bulan terpilih untuk tabel (dengan placeholder penuh sesuai hari dalam bulan)
  const monthRowsDisplay = useMemo(() => {
    return buildMonthRows(absensiRaw, selectedYear, selectedMonth);
  }, [absensiRaw, selectedYear, selectedMonth]);

  // Hanya data absensi yang benar-benar ada (tanpa placeholder), diurutkan terbaru → lama
  const monthActualRows = useMemo(() => {
    const filtered = absensiRaw.filter((r) => {
      const dt = new Date(r.tanggal);
      return dt.getFullYear() === selectedYear && (dt.getMonth() + 1) === selectedMonth;
    });
    filtered.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    return filtered.map(toDisplayRow);
  }, [absensiRaw, selectedYear, selectedMonth]);

  return (
    <>
      {/* ✅ NAVBAR */}
  <Navbar user={user} notifications={useMemo(() => {
    const notifs = [];
    const today = new Date();
    const todayKey = today.getFullYear() + "-" + pad(today.getMonth() + 1) + "-" + pad(today.getDate());
    // Cek apakah ada absen hari ini
    const adaHariIni = absensiRaw.some(r => {
      const k = new Date(r.tanggal);
      const key = k.getFullYear() + "-" + pad(k.getMonth() + 1) + "-" + pad(k.getDate());
      return key === todayKey;
    });
    if (!adaHariIni) {
      notifs.push({ title: "Belum Absen Masuk", message: "Anda belum melakukan absen hari ini." });
    } else {
      // cek apakah jam pulang sudah diisi
      const recordHariIni = absensiRaw.find(r => {
        const k = new Date(r.tanggal);
        const key = k.getFullYear() + "-" + pad(k.getMonth() + 1) + "-" + pad(k.getDate());
        return key === todayKey;
      });
      if (recordHariIni && !recordHariIni.jamPulang) {
        notifs.push({ title: "Belum Absen Pulang", message: "Jangan lupa absen pulang setelah selesai." });
      }
    }
    // Info keterlambatan (telat) hari ini
    const telatToday = absensiRaw.some(r => {
      const k = new Date(r.tanggal);
      const key = k.getFullYear() + "-" + pad(k.getMonth() + 1) + "-" + pad(k.getDate());
      return key === todayKey && r.status === 'telat';
    });
    if (telatToday) {
      notifs.push({ title: "Status Telat", message: "Anda tercatat telat hari ini." });
    }
    return notifs;
  }, [absensiRaw])} />

      {/* ✅ MAIN CONTENT */}
      <div className="p-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div>
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>
            )}
            <ProfileCard user={user || { nama: "Memuat..." }} />

              <PresensiBox
                onSubmit={async (payload) => {
                  try {
                    await AbsensiAPI.masuk(payload);
                    const data = await AbsensiAPI.getRiwayat();
                    setAbsensiRaw(data);
                  } catch (e) {
                    setError(e.message || "Gagal absen masuk");
                  }
                }}
                onPulang={async (payload) => {
                  try {
                    await AbsensiAPI.pulang(payload);
                    const data = await AbsensiAPI.getRiwayat();
                    setAbsensiRaw(data);
                  } catch (e) {
                    setError(e.message || "Gagal absen pulang");
                  }
                }}
              />
          </div>

          <div className="md:col-span-2">
            {loading ? (
              <div className="bg-white p-4 rounded shadow text-sm">Memuat data...</div>
            ) : (
              <>
                {/* Filter Bulan & Tahun */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <div>
                    <label className="text-xs block mb-1">Bulan</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      className="border p-2 rounded text-sm"
                    >
                      {monthNames.map((m, i) => (
                        <option key={i+1} value={i+1}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs block mb-1">Tahun</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="border p-2 rounded text-sm"
                    >
                      {yearsOptions.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <KehadiranTable data={monthActualRows} />
                <KehadiranSummary summary={summary} allRows={monthRowsDisplay} />
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
