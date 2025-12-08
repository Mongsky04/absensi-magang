// =========================
// EXPORT XLSX
// =========================
import * as XLSX from "xlsx";

// Helper: Format foto URL untuk XLSX
const formatFotoForXlsx = (foto) => {
  if (!foto || foto === "-" || foto === "null" || foto === null) return "-";
  return foto; // Return full URL
};

export const exportMonthToXlsx = (rows, filename, user) => {
  try {
    if (!Array.isArray(rows) || rows.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    // Header sesuai tabel Kehadiran Peserta
    const header = ["No", "Tanggal", "Check In", "Check Out", "Status", "Keterangan", "Link Foto"];
    
    const data = rows.map((r, idx) => [
      idx + 1,
      r.tanggal || "-",
      r.checkIn || "-",
      r.checkOut || "-",
      r.status || "-",
      r.keterangan || "-",
      formatFotoForXlsx(r.foto),
    ]);

    // Tambahkan signature section
    const mentorName = user?.mentor || "________________";
    const pemagangName = user?.nama || "________________";
    
    // Add empty rows and signature section
    data.push([]);  // Empty row
    data.push([]);  // Empty row
    data.push(["Mentor", "", "", "", "", "", "Pemagang"]);  // Labels
    data.push([]);  // Signature space
    data.push([]);  // Signature space
    data.push([mentorName, "", "", "", "", "", pemagangName]);  // Names

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet([header, ...data]);

    // Set column widths untuk readability
    ws["!cols"] = [
      { wch: 5 },   // No
      { wch: 12 },  // Tanggal
      { wch: 10 },  // Check In
      { wch: 10 },  // Check Out
      { wch: 10 },  // Status
      { wch: 30 },  // Keterangan
      { wch: 50 },  // Link Foto (URL panjang)
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rekap Kehadiran");

    // Write file
    XLSX.writeFile(wb, `${filename}.xlsx`);
  } catch (err) {
    console.error("Export XLSX Error:", err.message);
    alert("Gagal export XLSX: " + err.message);
  }
};
