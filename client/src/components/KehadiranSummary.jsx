// =========================
// KEHADIRAN SUMMARY MAGENTA STYLE
// =========================
import React from "react";
import { exportMonthToHtml } from "../utils/ExportHtml";

export default function KehadiranSummary({ summary, allRows = [], user = null, laporan = [] }) {
  const pad = (n) => (n < 10 ? "0" + n : String(n));

  // Check if user has pending laporan
  const hasPendingLaporan = React.useMemo(() => {
    return laporan.some(lap => lap.status === "pending");
  }, [laporan]);

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
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider">No</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider">Bulan</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider">Jumlah Kehadiran</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider">Jumlah Ketidakhadiran</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider">Download Rekap</th>
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
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-600">
                    {idx + 1}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-800 font-medium">
                    {row.bulan || "-"}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                    <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-700">
                      {row.hadir ?? 0}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                    <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-red-100 text-red-700">
                      {row.tidakHadir ?? 0}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="relative group">
                        <button
                          onClick={() => {
                            if (hasPendingLaporan) return;
                            const data = buildMonthRows(row.monthKey);
                            exportMonthToHtml(data, `rekap-${row.monthKey}`, user, row, laporan);
                          }}
                          disabled={hasPendingLaporan}
                          className={`p-2 rounded-lg transition ${
                            hasPendingLaporan
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-purple-100 hover:bg-purple-200 text-purple-600"
                          }`}
                          title={hasPendingLaporan ? "Download dinonaktifkan" : "Download HTML dengan Foto (Recommended)"}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                        {hasPendingLaporan && (
                          <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 z-10">
                            <div className="bg-slate-800 text-white text-xs rounded-lg py-2 px-3 shadow-lg">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>Download rekap dinonaktifkan karena Anda memiliki laporan ketidakhadiran yang belum disetujui admin</span>
                              </div>
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800"></div>
                            </div>
                          </div>
                        )}
                      </div>
                      {hasPendingLaporan && (
                        <span className="text-[10px] text-red-600 font-medium">
                          Laporan Pending
                        </span>
                      )}
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
