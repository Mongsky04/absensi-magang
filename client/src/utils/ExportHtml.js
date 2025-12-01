// =========================
// EXPORT HTML WITH EMBEDDED IMAGES
// =========================
// File HTML ini bisa dibuka di Excel dan akan menampilkan gambar asli

const fetchImageAsBase64 = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error('Failed to fetch image:', url, err);
    return null;
  }
};

export const exportMonthToHtml = async (rows, filename, user = null) => {
  try {
    if (!Array.isArray(rows) || rows.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    // Extract user info
    const pemagang = user?.nama || 'Nama Pemagang';
    const mentor = user?.mentor || 'Nama Mentor';

    // Show loading
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'export-loading';
    loadingDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      color: white;
      font-family: sans-serif;
    `;
    loadingDiv.innerHTML = `
      <div style="text-align: center;">
        <div style="width: 50px; height: 50px; border: 4px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
        <p style="font-size: 16px; font-weight: 600;">Mengunduh gambar...</p>
        <p style="font-size: 12px; opacity: 0.8;">Mohon tunggu, sedang memproses foto presensi</p>
      </div>
      <style>
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    `;
    document.body.appendChild(loadingDiv);

    // Filter rows that have actual data
    const dataRows = rows.filter(r => r.checkIn !== "-" || r.checkOut !== "-");

    // Fetch all images as base64
    const rowsWithImages = await Promise.all(
      dataRows.map(async (r, idx) => {
        let imageData = null;
        if (r.foto && r.foto !== "-" && r.foto !== "null") {
          imageData = await fetchImageAsBase64(r.foto);
        }
        return { ...r, imageData, no: idx + 1 };
      })
    );

    // Remove loading
    document.body.removeChild(loadingDiv);

    // Generate HTML
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Rekap Kehadiran - ${filename}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 20px;
      background: #f5f5f5;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 {
      color: #0d9488;
      border-bottom: 3px solid #0d9488;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th {
      background-color: #0d9488;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      border: 1px solid #0a7a6e;
    }
    td {
      padding: 10px;
      border: 1px solid #e2e8f0;
      font-size: 13px;
      vertical-align: middle;
    }
    tr:nth-child(even) {
      background-color: #f8fafc;
    }
    tr:hover {
      background-color: #e0f2f1;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-hadir {
      background-color: #d1fae5;
      color: #065f46;
    }
    .status-telat {
      background-color: #fef3c7;
      color: #92400e;
    }
    .status-izin, .status-sakit {
      background-color: #dbeafe;
      color: #1e40af;
    }
    .foto-cell {
      text-align: center;
      padding: 5px;
    }
    .foto-cell img {
      max-width: 60px;
      max-height: 45px;
      border-radius: 3px;
      border: 1px solid #cbd5e1;
      object-fit: cover;
    }
    .no-foto {
      color: #94a3b8;
      font-style: italic;
      font-size: 11px;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      color: #64748b;
      font-size: 12px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }
    .signature-section {
      margin-top: 50px;
      display: flex;
      justify-content: space-between;
      padding: 0 50px;
      page-break-inside: avoid;
    }
    .signature-box {
      text-align: center;
      width: 40%;
    }
    .signature-label {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 10px;
      font-size: 14px;
    }
    .signature-space {
      height: 80px;
      border-bottom: 2px solid #cbd5e1;
      margin: 20px auto;
      width: 200px;
    }
    .signature-name {
      font-weight: 600;
      color: #334155;
      margin-top: 10px;
      font-size: 14px;
    }
    @media print {
      .container {
        box-shadow: none;
      }
      tr {
        page-break-inside: avoid;
      }
      .signature-section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 Rekap Kehadiran Peserta Magang</h1>
    <p><strong>Periode:</strong> ${filename.replace('rekap-', '')}</p>
    <p><strong>Total Data:</strong> ${rowsWithImages.length} hari</p>
    
    <table>
      <thead>
        <tr>
          <th style="width: 40px;">No</th>
          <th style="width: 100px;">Tanggal</th>
          <th style="width: 140px;">Foto Presensi</th>
          <th style="width: 80px;">Check In</th>
          <th style="width: 80px;">Check Out</th>
          <th style="width: 100px;">Status</th>
          <th>Keterangan</th>
        </tr>
      </thead>
      <tbody>
        ${rowsWithImages.map(r => {
          const statusClass = r.status.toLowerCase();
          return `
            <tr>
              <td style="text-align: center;">${r.no}</td>
              <td>${r.tanggal}</td>
              <td class="foto-cell">
                ${r.imageData 
                  ? `<img src="${r.imageData}" alt="Foto ${r.tanggal}">` 
                  : '<span class="no-foto">Tidak ada foto</span>'
                }
              </td>
              <td style="color: #0d9488; font-weight: 500;">${r.checkIn}</td>
              <td style="color: #64748b;">${r.checkOut}</td>
              <td>
                <span class="status-badge status-${statusClass}">${r.status}</span>
              </td>
              <td style="color: #475569;">${r.keterangan || '-'}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
    
    <!-- Signature Section -->
    <div class="signature-section">
      <div class="signature-box">
        <div class="signature-label">Mentor</div>
        <div class="signature-space"></div>
        <div class="signature-name">${mentor}</div>
      </div>
      <div class="signature-box">
        <div class="signature-label">Pemagang</div>
        <div class="signature-space"></div>
        <div class="signature-name">${pemagang}</div>
      </div>
    </div>
    
    <div class="footer">
      <p>Dokumen ini dibuat secara otomatis oleh Sistem Absensi Magang - PT Jasamarga Jalanlayang Cikampek</p>
      <p>Tanggal Generate: ${new Date().toLocaleString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Create blob and download
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    alert(`File HTML berhasil didownload! File bisa dibuka di browser atau import ke Excel/Word.`);
  } catch (err) {
    console.error('Export HTML Error:', err);
    alert('Gagal export HTML: ' + err.message);
  }
};
