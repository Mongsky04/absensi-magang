// =========================
// EXPORT CSV
// =========================
// Bulan penuh (1..n) dengan kolom standar
export const exportMonthToCsv = (rows, filename) => {
  try {
    if (!Array.isArray(rows) || rows.length === 0) {
      console.warn("Tidak ada data untuk diekspor CSV");
      return;
    }
    // Sesuai tabel Kehadiran Peserta
    const headers = ["No","Tanggal","Check In","Check Out","Status","Keterangan","Foto"]; // maintain order
    const lines = [headers.join(",")];
    rows.forEach((r, idx) => {
      const vals = [idx + 1, r.tanggal, r.checkIn, r.checkOut, r.status, r.keterangan, r.foto ?? "-"];
      lines.push(vals.map(v => {
        const s = v == null ? "" : String(v);
        // Simple CSV escaping: replace commas to avoid column break
        return s.replace(/,/g, ";");
      }).join(","));
    });
    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  } catch (err) {
    console.error("Export CSV Error:", err.message);
  }
};
