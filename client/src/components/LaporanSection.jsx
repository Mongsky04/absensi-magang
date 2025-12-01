// =========================
// LAPORAN SECTION
// =========================
import React from "react";

export default function LaporanSection({ laporan = [] }) {
  if (!laporan || laporan.length === 0) {
    return null;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Disetujui
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Ditolak
          </span>
        );
      default:
        return null;
    }
  };

  const getJenisBadge = (jenis) => {
    switch (jenis) {
      case "izin":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
            Izin
          </span>
        );
      case "sakit":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
            Sakit
          </span>
        );
      case "lupa":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
            Lupa Absen
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    const options = { 
      year: "numeric", 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return date.toLocaleDateString("id-ID", options);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <h2 className="font-semibold text-xl text-slate-800 flex items-center gap-2">
          <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Riwayat Pelaporan
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Daftar laporan izin, sakit, atau lupa absen yang Anda kirimkan
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Tanggal Laporan
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Tanggal Kejadian
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Jenis
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Keterangan
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Bukti
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {laporan.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3 text-sm text-slate-600">
                  {formatDateTime(item.createdAt)}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-slate-800">
                  {formatDate(item.tanggal)}
                </td>
                <td className="px-4 py-3">
                  {getJenisBadge(item.jenis)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  <div className="max-w-xs truncate" title={item.keterangan}>
                    {item.keterangan}
                  </div>
                  {item.responseNote && (
                    <div className="mt-1 text-xs text-slate-500 italic">
                      Catatan: {item.responseNote}
                    </div>
                  )}
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
                  {getStatusBadge(item.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Footer */}
      {laporan.some(l => l.status === "pending") && (
        <div className="p-4 bg-blue-50 border-t border-blue-100">
          <div className="flex items-start gap-2 text-sm text-blue-800">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p>
              Laporan dengan status <strong>Pending</strong> sedang dalam proses review oleh mentor. 
              Anda akan menerima notifikasi setelah laporan disetujui atau ditolak.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
