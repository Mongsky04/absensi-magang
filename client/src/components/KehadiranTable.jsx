// =========================
// KEHADIRAN TABLE MAGENTA STYLE
// =========================
import React, { useState, useMemo } from "react";

const ITEMS_PER_PAGE = 10;

export default function KehadiranTable({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [preview, setPreview] = useState("");

  // Filter out empty rows and sort by date descending
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter(row => row.checkIn !== "-" || row.checkOut !== "-" || row.status !== "-");
  }, [data]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "-") return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || "";
    
    if (statusLower === "hadir") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-teal-100 text-teal-700">
          Present
        </span>
      );
    }
    if (statusLower === "telat") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-amber-100 text-amber-700">
          Telat
        </span>
      );
    }
    if (statusLower === "izin" || statusLower === "sakit") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border border-slate-300 text-slate-500">
        No Data
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <h2 className="font-semibold text-xl text-slate-800">Data Kehadiran Peserta</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">No</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tanggal</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Foto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Check In</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Check Out</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Alasan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  Belum ada data kehadiran
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-800 font-medium">
                    {formatDate(row.tanggal)}
                  </td>
                  <td className="px-4 py-3">
                    {row.foto ? (
                      <button
                        onClick={() => setPreview(row.foto)}
                        title="Klik untuk memperbesar foto"
                        className="group relative w-12 h-12 rounded-lg overflow-hidden border-2 border-slate-200 hover:border-teal-500 hover:shadow-md transition cursor-pointer"
                      >
                        <img 
                          src={row.foto} 
                          alt="Foto presensi" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                          <svg className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </button>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center" title="Tidak ada foto">
                        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-teal-600 font-medium">
                    {row.checkIn || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {row.checkOut || "-"}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(row.status)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {row.keterangan && row.keterangan !== "-" ? row.keterangan : "Tanpa Keterangan"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-lg font-medium transition ${
                  currentPage === pageNum
                    ? "bg-teal-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Photo Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50 backdrop-blur-sm"
          onClick={() => setPreview("")}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setPreview("")}
              className="absolute -top-12 right-0 text-white hover:text-slate-300 transition"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={preview} 
              alt="Preview Foto Presensi" 
              className="max-h-[85vh] w-auto mx-auto rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
