// =========================
// DASHBOARD PAGE MAGENTA STYLE
// =========================
import React, { useEffect, useState, useMemo } from "react";

import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import PresensiBox from "../components/PresensiBox";
import KehadiranTable from "../components/KehadiranTable";
import KehadiranSummary from "../components/KehadiranSummary";
import LaporanSection from "../components/LaporanSection";

import AbsensiAPI from "../api/AbsensiApi";
import UserAPI from "../api/UserAPI";
import { setAuthToken } from "../api/axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [absensiRaw, setAbsensiRaw] = useState([]);
  const [riwayat, setRiwayat] = useState([]);
  const [summary, setSummary] = useState([]);
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dropdown bulan & tahun
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const pad = (n) => (n < 10 ? "0" + n : String(n));

  const toDisplayRow = (a) => {
    const fmtTime = (d) => {
      if (!d) return "-";
      const dt = new Date(d);
      return pad(dt.getHours()) + ":" + pad(dt.getMinutes()) + ":" + pad(dt.getSeconds());
    };
    const fmtDate = (d) => {
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

  const buildMonthRows = (raw, year, month) => {
    const monthKey = year + "-" + pad(month);
    const daysInMonth = new Date(year, month, 0).getDate();
    const mapTanggal = new Map(
      raw
        .filter(r => {
          const dt = new Date(r.tanggal);
          return dt.getFullYear() === year && (dt.getMonth() + 1) === month;
        })
        .map(r => {
          const dStr = new Date(r.tanggal).toISOString().slice(0, 10);
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

  // Get today's record for PresensiBox
  const todayRecord = useMemo(() => {
    const today = new Date();
    const todayKey = today.getFullYear() + "-" + pad(today.getMonth() + 1) + "-" + pad(today.getDate());
    return absensiRaw.find(r => {
      const dt = new Date(r.tanggal);
      const key = dt.getFullYear() + "-" + pad(dt.getMonth() + 1) + "-" + pad(dt.getDate());
      return key === todayKey;
    });
  }, [absensiRaw]);

  const yearsOptions = useMemo(() => {
    const set = new Set(absensiRaw.map(a => new Date(a.tanggal).getFullYear()));
    set.add(now.getFullYear());
    return Array.from(set.values()).sort((a, b) => a - b);
  }, [absensiRaw]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
    
    const load = async () => {
      try {
        const [profile, absensi, laporanData] = await Promise.all([
          UserAPI.getProfile(),
          AbsensiAPI.getRiwayat(),
          AbsensiAPI.getLaporan(),
        ]);
        setUser(profile);
        setAbsensiRaw(absensi);
        setLaporan(laporanData);
        setRiwayat(buildMonthRows(absensi, selectedYear, selectedMonth));
        setSummary(computeMonthSummary(absensi, selectedYear, selectedMonth));
      } catch (err) {
        setError(err.message || err.error || "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!absensiRaw || absensiRaw.length === 0) {
      setRiwayat(buildMonthRows([], selectedYear, selectedMonth));
      setSummary(computeMonthSummary([], selectedYear, selectedMonth));
      return;
    }
    setRiwayat(buildMonthRows(absensiRaw, selectedYear, selectedMonth));
    setSummary(computeMonthSummary(absensiRaw, selectedYear, selectedMonth));
  }, [absensiRaw, selectedMonth, selectedYear]);

  const monthRowsDisplay = useMemo(() => {
    return buildMonthRows(absensiRaw, selectedYear, selectedMonth);
  }, [absensiRaw, selectedYear, selectedMonth]);

  const monthActualRows = useMemo(() => {
    const filtered = absensiRaw.filter((r) => {
      const dt = new Date(r.tanggal);
      return dt.getFullYear() === selectedYear && (dt.getMonth() + 1) === selectedMonth;
    });
    filtered.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    return filtered.map(toDisplayRow);
  }, [absensiRaw, selectedYear, selectedMonth]);

  // Notifications
  const notifications = useMemo(() => {
    const notifs = [];
    const today = new Date();
    const todayKey = today.getFullYear() + "-" + pad(today.getMonth() + 1) + "-" + pad(today.getDate());
    
    const adaHariIni = absensiRaw.some(r => {
      const k = new Date(r.tanggal);
      const key = k.getFullYear() + "-" + pad(k.getMonth() + 1) + "-" + pad(k.getDate());
      return key === todayKey;
    });
    
    if (!adaHariIni) {
      notifs.push({ title: "Belum Absen Masuk", message: "Anda belum melakukan absen hari ini." });
    } else {
      const recordHariIni = absensiRaw.find(r => {
        const k = new Date(r.tanggal);
        const key = k.getFullYear() + "-" + pad(k.getMonth() + 1) + "-" + pad(k.getDate());
        return key === todayKey;
      });
      if (recordHariIni && !recordHariIni.jamPulang) {
        notifs.push({ title: "Belum Absen Pulang", message: "Jangan lupa absen pulang setelah selesai." });
      }
    }
    
    const telatToday = absensiRaw.some(r => {
      const k = new Date(r.tanggal);
      const key = k.getFullYear() + "-" + pad(k.getMonth() + 1) + "-" + pad(k.getDate());
      return key === todayKey && r.status === "telat";
    });
    
    if (telatToday) {
      notifs.push({ title: "Status Telat", message: "Anda tercatat telat hari ini." });
    }
    
    return notifs;
  }, [absensiRaw]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <Navbar user={user} notifications={notifications} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile & Presensi */}
            <div className="lg:col-span-1 space-y-6">
              <ProfileCard user={user} />
              <PresensiBox
                todayRecord={todayRecord}
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

            {/* Right Column - Data Kehadiran */}
            <div className="lg:col-span-2">
              {/* Filter Section */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bulan</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      className="w-40 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      {monthNames.map((m, i) => (
                        <option key={i + 1} value={i + 1}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tahun</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="w-28 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      {yearsOptions.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Kehadiran Table */}
              <KehadiranTable data={monthActualRows} />

              {/* Summary Table */}
              <KehadiranSummary summary={summary} allRows={absensiRaw} user={user} />

              {/* Laporan Section */}
              <LaporanSection laporan={laporan} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
