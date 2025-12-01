// =========================
// PRESENSI BOX MAGENTA STYLE
// =========================
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

export default function PresensiBox({ onSubmit, onPulang, todayRecord }) {
  const webcamRef = useRef(null);
  const [keterangan, setKeterangan] = useState("");
  const [foto, setFoto] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const ambilFoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setFoto(imageSrc);
    setShowCamera(false);
  };

  const compressImage = async (dataUrl, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 640;
        const maxHeight = 480;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = dataUrl;
    });
  };

  const dataUrlToBlob = (dataUrl) => {
    if (!dataUrl) return null;
    try {
      const [header, base64] = dataUrl.split(",");
      const mime = header.match(/data:(.*);base64/)[1];
      const bin = atob(base64);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      return new Blob([arr], { type: mime });
    } catch (e) {
      console.error("Error converting dataUrl to blob:", e);
      return null;
    }
  };

  const handleCheckIn = async () => {
    // Validasi waktu di client side
    const now = new Date();
    const currentHour = now.getHours();
    
    if (currentHour < 6 || currentHour >= 17) {
      alert(`Check-in hanya dapat dilakukan antara jam 06:00 - 17:00. Sekarang jam ${formatTime(now)}.`);
      return;
    }

    if (!foto) {
      setShowCamera(true);
      return;
    }
    
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("keterangan", keterangan);

      const compressedFoto = await compressImage(foto, 0.6);
      const blob = dataUrlToBlob(compressedFoto);
      if (blob) {
        fd.append("foto", blob, "presensi.jpg");
      }

      await onSubmit?.(fd);
      setKeterangan("");
      setFoto(null);
    } catch (e) {
      console.error("Check-in error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    // Validasi waktu di client side juga
    const now = new Date();
    const currentHour = now.getHours();
    
    if (currentHour < 17) {
      alert(`Check-out hanya dapat dilakukan setelah jam 17:00. Sekarang jam ${formatTime(now)}.`);
      return;
    }
    
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("keterangan", keterangan);
      await onPulang?.(fd);
      setKeterangan("");
    } catch (e) {
      console.error("Check-out error:", e);
    } finally {
      setLoading(false);
    }
  };

  const hasCheckedIn = todayRecord?.jamMasuk;
  const hasCheckedOut = todayRecord?.jamPulang;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <h2 className="font-semibold text-lg text-slate-800">Presensi</h2>
        <p className="text-sm text-slate-500 mt-1">
          Lakukan check-in dan check-out untuk melengkapi daftar hadir harian Anda
        </p>
      </div>

      {/* Time Display */}
      <div className="p-5 text-center border-b border-slate-100">
        <div className="text-slate-500 text-sm">{formatDate(currentTime)}</div>
        <div className="text-4xl font-bold text-teal-600 mt-2 font-mono tracking-wider">
          {formatTime(currentTime)}
        </div>
      </div>

      {/* Camera Section */}
      {showCamera && (
        <div className="p-4 border-b border-slate-100">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="w-full h-48 object-cover rounded-lg border border-slate-200"
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={ambilFoto}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium transition"
            >
              📸 Ambil Foto
            </button>
            <button
              onClick={() => setShowCamera(false)}
              className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded-lg font-medium transition"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Photo Preview */}
      {foto && !showCamera && (
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <img src={foto} alt="Foto presensi" className="w-full h-48 object-cover rounded-lg" />
            <button
              onClick={() => setShowCamera(true)}
              className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-slate-700 text-xs px-3 py-1.5 rounded-lg shadow transition"
            >
              📷 Ambil Ulang
            </button>
          </div>
        </div>
      )}

      {/* Check-in / Check-out Buttons */}
      <div className="p-4">
        {/* Info Text untuk Check-in */}
        {!hasCheckedIn && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Check-in dapat dilakukan antara jam <strong>06:00 - 17:00</strong>
            </p>
          </div>
        )}

        {/* Info Text untuk Check-out */}
        {hasCheckedIn && !hasCheckedOut && (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Check-out hanya dapat dilakukan setelah jam <strong>17:00</strong>
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          {/* Check-in Button */}
          <button
            onClick={handleCheckIn}
            disabled={loading || hasCheckedIn}
            className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition ${
              hasCheckedIn
                ? "border-green-200 bg-green-50 cursor-not-allowed"
                : "border-slate-200 hover:border-teal-300 hover:bg-teal-50 cursor-pointer"
            }`}
          >
            <div className={`text-2xl ${hasCheckedIn ? "text-green-500" : "text-slate-400"}`}>
              {hasCheckedIn ? "✓" : "→"}
            </div>
            <span className={`text-sm font-medium mt-1 ${hasCheckedIn ? "text-green-600" : "text-slate-600"}`}>
              Check-in
            </span>
            <span className={`text-xs mt-0.5 ${hasCheckedIn ? "text-green-500" : "text-slate-400"}`}>
              {hasCheckedIn
                ? new Date(todayRecord.jamMasuk).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                : "00:00:00"}
            </span>
          </button>

          {/* Check-out Button */}
          <button
            onClick={handleCheckOut}
            disabled={loading || !hasCheckedIn || hasCheckedOut || (hasCheckedIn && !hasCheckedOut && new Date().getHours() < 17)}
            className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition ${
              hasCheckedOut
                ? "border-green-200 bg-green-50 cursor-not-allowed"
                : !hasCheckedIn
                ? "border-slate-100 bg-slate-50 cursor-not-allowed opacity-50"
                : new Date().getHours() < 17
                ? "border-slate-100 bg-slate-50 cursor-not-allowed opacity-50"
                : "border-slate-200 hover:border-amber-300 hover:bg-amber-50 cursor-pointer"
            }`}
          >
            <div className={`text-2xl ${hasCheckedOut ? "text-green-500" : "text-slate-400"}`}>
              {hasCheckedOut ? "✓" : "←"}
            </div>
            <span className={`text-sm font-medium mt-1 ${hasCheckedOut ? "text-green-600" : "text-slate-600"}`}>
              Check-out
            </span>
            <span className={`text-xs mt-0.5 ${hasCheckedOut ? "text-green-500" : "text-slate-400"}`}>
              {hasCheckedOut
                ? new Date(todayRecord.jamPulang).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                : hasCheckedIn && new Date().getHours() < 17
                ? "Tersedia 17:00"
                : "00:00:00"}
            </span>
          </button>
        </div>

        {/* Keterangan Input */}
        <div className="mt-4">
          <textarea
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            placeholder="Tambahkan keterangan (opsional)"
            className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            rows={2}
          />
        </div>

        {/* Help Link */}
        <div className="mt-4 text-center">
          <a href="/lapor-absen" className="text-sm text-teal-600 hover:text-teal-700 hover:underline">
            Tidak hadir atau lupa absen? <span className="font-medium">Lapor disini</span>
          </a>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
