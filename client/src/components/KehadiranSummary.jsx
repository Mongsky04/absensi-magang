// =========================
// KEHADIRAN SUMMARY MAGENTA STYLE
// =========================
import React from "react";
import { exportMonthToHtml } from "../utils/ExportHtml";

export default function KehadiranSummary({ summary, allRows = [], user = null }) {
  const pad = (n) => (n < 10 ? "0" + n : String(n));

  // Debug log
  React.useEffect(() => {
    console.log('KehadiranSummary - allRows:', allRows);
    console.log('KehadiranSummary - summary:', summary);
  }, [allRows, summary]);

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

  const buildMonthRows = (monthKey) => {
    if (!monthKey || typeof monthKey !== "string") return [];

    const parts = monthKey.split("-");
    if (parts.length !== 2) return [];

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    if (isNaN(year) || isNaN(month)) return [];

    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Filter data dari allRows (raw absensi) untuk bulan ini
    const byDate = new Map();
    if (Array.isArray(allRows)) {
      allRows.forEach(rawItem => {
        if (!rawItem || !rawItem.tanggal) return;
        const dt = new Date(rawItem.tanggal);
        if (dt.getFullYear() === year && (dt.getMonth() + 1) === month) {
          const dateStr = dt.getFullYear() + "-" + pad(dt.getMonth() + 1) + "-" + pad(dt.getDate());
          byDate.set(dateStr, toDisplayRow(rawItem));
        }
      });
    }

    const rows = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${pad(month)}-${pad(d)}`;
      const found = byDate.get(dateStr);
      
      if (found) {
        rows.push(found);
      } else {
        rows.push({
          tanggal: dateStr,
          checkIn: "-",
          checkOut: "-",
          status: "-",
          keterangan: "-",
          foto: null,
        });
      }
    }
    
    return rows;
  };



  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <h2 className="font-semibold text-xl text-slate-800">Rangkuman Kehadiran Peserta</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">No</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Bulan Tahun</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Jumlah Kehadiran</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Jumlah Ketidakhadiran</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Download Rekap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(!summary || summary.length === 0) ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Belum ada data rangkuman
                </td>
              </tr>
            ) : (
              summary.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-800 font-medium">
                    {row.bulan || "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                      {row.hadir ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                      {row.tidakHadir ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          const data = buildMonthRows(row.monthKey);
                          exportMonthToHtml(data, `rekap-${row.monthKey}`, user);
                        }}
                        className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-600 transition"
                        title="Download HTML dengan Foto (Recommended)"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
  );
}
