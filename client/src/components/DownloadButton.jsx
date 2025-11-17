// =========================
// BUTTON DOWNLOAD CSV / XLSX
// =========================
import React from "react";
import { exportMonthToCsv } from "../utils/ExportCsv";
import { exportMonthToXlsx } from "../utils/ExportXlsx";

export default function DownloadButton({ rows = [], filename = "rekap-bulan" }) {
  return (
    <div className="flex gap-2">

      <button
        onClick={() => exportMonthToCsv(rows, filename)}
        className="bg-blue-600 text-white p-2 rounded-md"
      >
        CSV ⬇️
      </button>

      <button
        onClick={() => exportMonthToXlsx(rows, filename)}
        className="bg-green-600 text-white p-2 rounded-md"
      >
        XLSX ⬇️
      </button>

    </div>
  );
}
