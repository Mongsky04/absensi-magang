import React, { useState } from "react";

export default function KehadiranTable({ data }) {
  const [preview, setPreview] = useState("");
  const [expanded, setExpanded] = useState({}); // per-card expansion state for mobile
  const toggleExpand = (idx) => setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  const truncate = (str, n = 80) => {
    if (!str || typeof str !== "string") return "-";
    if (str.length <= n) return str;
    return str.slice(0, n) + "…";
  };
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-3">Data Kehadiran Peserta</h2>

      {/* Mobile list (stacked) */}
      <div className="md:hidden space-y-2">
        {(!data || data.length === 0) ? (
          <div className="p-3 text-center text-sm text-gray-500 border rounded">Belum ada data</div>
        ) : (
          data.map((row, idx) => (
            <div key={idx} className="border rounded p-2">
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm">{row.tanggal || "-"}</div>
                <span
                  className={
                    "px-2 py-1 rounded text-xs font-medium " +
                    (row.status === "Hadir"
                      ? "bg-green-100 text-green-700"
                      : row.status === "Izin"
                      ? "bg-yellow-100 text-yellow-700"
                      : row.status === "Alpa"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700")
                  }
                >
                  {row.status || "-"}
                </span>
              </div>
              <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-gray-500">Check In</div>
                  <div className="font-medium">{row.checkIn || "-"}</div>
                </div>
                <div>
                  <div className="text-gray-500">Check Out</div>
                  <div className="font-medium">{row.checkOut || "-"}</div>
                </div>
              </div>
              {/* Detail toggle for Keterangan */}
              <div className="mt-1 text-right">
                <button
                  className="text-xs text-blue-600 underline"
                  onClick={() => toggleExpand(idx)}
                >
                  {expanded[idx] ? "Sembunyikan" : "Detail"}
                </button>
              </div>
              {expanded[idx] && (
                <div className="mt-1 text-xs">
                  <div className="text-gray-500">Keterangan</div>
                  <div className="font-medium wrap-break-word">{row.keterangan || "-"}</div>
                </div>
              )}
              {row.foto ? (
                <div className="mt-2">
                  <button
                    className="text-xs text-blue-600 underline"
                    onClick={() => setPreview(row.foto)}
                  >
                    Lihat foto
                  </button>
                </div>
              ) : null}
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
              <th className="border p-2">Tanggal</th>
              <th className="border p-2">Check In</th>
              <th className="border p-2">Check Out</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Keterangan</th>
              <th className="border p-2">Foto</th>
            </tr>
          </thead>

          <tbody>
            {(!data || data.length === 0) ? (
              <tr><td className="p-3 text-center" colSpan={7}>Belum ada data</td></tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                  <td className="border p-2 text-center">{idx + 1}</td>
                  <td className="border p-2">{row.tanggal || "-"}</td>
                  <td className="border p-2 text-center">{row.checkIn || "-"}</td>
                  <td className="border p-2 text-center">{row.checkOut || "-"}</td>
                  <td className="border p-2 text-center">
                    <span
                      className={
                        "px-2 py-1 rounded text-xs font-medium " +
                        (row.status === "Hadir"
                          ? "bg-green-100 text-green-700"
                          : row.status === "Izin"
                          ? "bg-yellow-100 text-yellow-700"
                          : row.status === "Alpa"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700")
                      }
                    >
                      {row.status || "-"}
                    </span>
                  </td>
                  <td className="border p-2">{row.keterangan || "-"}</td>
                  <td className="border p-2 text-center">
                    {row.foto ? (
                      <img
                        src={row.foto}
                        alt="bukti presensi"
                        className="w-12 h-12 object-cover rounded cursor-pointer inline-block"
                        onClick={() => setPreview(row.foto)}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {preview && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50"
          onClick={() => setPreview("")}
        >
          <img src={preview} alt="preview" className="max-h-[80vh] rounded shadow-lg" />
        </div>
      )}
    </div>
  );
}
