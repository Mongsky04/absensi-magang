// =========================
// EXPORT CSV
// =========================
// Bulan penuh (1..n) dengan kolom standar

// Helper: Proper CSV escaping (RFC 4180 compliant)
const escapeCsvValue = (value) => {
  if (value == null || value === "") return "";
  const str = String(value);
  // If contains comma, quote, newline, or starts/ends with space -> wrap in quotes
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r") || str.startsWith(" ") || str.endsWith(" ")) {
    // Escape double quotes by doubling them
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
};

// Helper: Format foto URL untuk CSV (shortened jika terlalu panjang)
const formatFotoForCsv = (foto) => {
  if (!foto || foto === "-" || foto === "null") return "-";
  // Tampilkan URL lengkap agar bisa di-klik dari Excel
  return foto;
};

export const exportMonthToCsv = (rows, filename, user) => {
  try {
    if (!Array.isArray(rows) || rows.length === 0) {
      alert("Tidak ada data untuk diekspor");
      console.warn("Tidak ada data untuk diekspor CSV");
      return;
    }

    // Header sesuai tabel Kehadiran Peserta
    const headers = ["No", "Tanggal", "Check In", "Check Out", "Status", "Keterangan", "Link Foto"];
    const lines = [headers.map(escapeCsvValue).join(",")];

    rows.forEach((r, idx) => {
      const vals = [
        idx + 1,
        r.tanggal || "-",
        r.checkIn || "-",
        r.checkOut || "-",
        r.status || "-",
        r.keterangan || "-",
        formatFotoForCsv(r.foto)
      ];
      lines.push(vals.map(escapeCsvValue).join(","));
    });

    // Tambahkan signature section di bawah tabel
    lines.push(""); // Empty row
    lines.push(""); // Empty row
    
    // Row dengan label Mentor dan Pemagang
    const mentorName = user?.mentor || "________________";
    const pemagangName = user?.nama || "________________";
    
    lines.push(["Mentor", "", "", "", "", "", "Pemagang"].map(escapeCsvValue).join(","));
    lines.push(""); // Signature space row
    lines.push(""); // Signature space row
    lines.push([mentorName, "", "", "", "", "", pemagangName].map(escapeCsvValue).join(","));

    const csvContent = lines.join("\r\n"); // Use CRLF for better Excel compatibility
    
    // Add UTF-8 BOM for Excel to recognize encoding correctly
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error("Export CSV Error:", err.message);
    alert("Gagal export CSV: " + err.message);
  }
};
