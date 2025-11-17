import React from "react";
import DownloadButton from "./DownloadButton";

export default function KehadiranSummary({ summary, allRows = [] }) {
  const buildMonthRows = (monthKey) => {
    // monthKey = YYYY-MM
    const [year, month] = monthKey.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const byDate = new Map(
      allRows
        .filter(r => typeof r.tanggal === "string" && r.tanggal.startsWith(monthKey))
        .map(r => [r.tanggal, r])
    );
    const pad = (n) => (n < 10 ? "0" + n : n);
    const rows = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${pad(month)}-${pad(d)}`;
      const found = byDate.get(dateStr);
      rows.push(
        found || {
          tanggal: dateStr,
          checkIn: "-",
          checkOut: "-",
          status: "-",
          keterangan: "-",
          foto: "-",
        }
      );
    }
    return rows;
  };
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-3">Rangkuman Kehadiran Peserta</h2>

      {/* Mobile stacked cards */}
      <div className="md:hidden space-y-3">
        {(!summary || summary.length === 0) ? (
          <div className="p-3 text-center text-sm text-gray-500 border rounded">Belum ada data</div>
        ) : (
          summary.map((row, idx) => (
            <div key={idx} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{row.bulan || "-"}</div>
                <DownloadButton
                  rows={buildMonthRows(row.monthKey)}
                  filename={`rekap-${row.monthKey}`}
                />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-gray-500">Kehadiran</div>
                  <div className="font-medium">{row.hadir ?? 0}</div>
                </div>
                <div>
                  <div className="text-gray-500">Ketidakhadiran</div>
                  <div className="font-medium">{row.tidakHadir ?? 0}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">No</th>
              <th className="border p-2">Bulan Tahun</th>
              <th className="border p-2">Jumlah Kehadiran</th>
              <th className="border p-2">Jumlah Ketidakhadiran</th>
              <th className="border p-2">Download</th>
            </tr>
          </thead>

          <tbody>
            {(!summary || summary.length === 0) ? (
              <tr><td className="p-3 text-center" colSpan={5}>Belum ada data</td></tr>
            ) : (
              summary.map((row, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                  <td className="border p-2 text-center">{row.no ?? idx + 1}</td>
                  <td className="border p-2">{row.bulan || "-"}</td>
                  <td className="border p-2 text-center">{row.hadir ?? 0}</td>
                  <td className="border p-2 text-center">{row.tidakHadir ?? 0}</td>
                  <td className="border p-2">
                    <DownloadButton
                      rows={buildMonthRows(row.monthKey)}
                      filename={`rekap-${row.monthKey}`}
                    />
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
