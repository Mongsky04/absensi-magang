// =========================
// EXPORT XLSX
// =========================
import * as XLSX from "xlsx";

export const exportMonthToXlsx = (rows, filename) => {
  try {
    if (!Array.isArray(rows) || rows.length === 0) return;
    // Header sesuai tabel Kehadiran Peserta
    const header = ["No","Tanggal","Check In","Check Out","Status","Keterangan","Foto"];    
    const data = rows.map((r, idx) => [
      idx + 1,
      r.tanggal,
      r.checkIn,
      r.checkOut,
      r.status,
      r.keterangan,
      r.foto ?? "-",
    ]);
    const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rekap Bulan");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  } catch (err) {
    console.error("Export XLSX Error:", err.message);
  }
};
