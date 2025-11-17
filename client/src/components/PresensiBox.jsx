// =========================
// PRESENSI DENGAN KAMERA
// =========================
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import api from "../api/axios";

export default function PresensiBox({ onSubmit, onPulang }) {
  const webcamRef = useRef(null);

  const [keterangan, setKeterangan] = useState("");
  const [foto, setFoto] = useState(null);

  const ambilFoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setFoto(imageSrc);
  };

  const compressImage = async (dataUrl, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
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
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.src = dataUrl;
    });
  };

  const dataUrlToBlob = (dataUrl) => {
    if (!dataUrl) return null;
    try {
      const [header, base64] = dataUrl.split(',');
      const mime = header.match(/data:(.*);base64/)[1];
      const bin = atob(base64);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      const blob = new Blob([arr], { type: mime });
      console.log('Created blob:', { size: blob.size, type: blob.type, sizeInMB: (blob.size / 1024 / 1024).toFixed(2) });
      return blob;
    } catch (e) {
      console.error('Error converting dataUrl to blob:', e);
      return null;
    }
  };

  const kirimPresensi = async () => {
    try {
      const fd = new FormData();
      fd.append('keterangan', keterangan);
      
      if (foto) {
        // Compress image first
        const compressedFoto = await compressImage(foto, 0.6);
        const blob = dataUrlToBlob(compressedFoto);
        
        if (blob) {
          console.log('Appending compressed foto blob:', { 
            size: blob.size, 
            type: blob.type,
            sizeInKB: (blob.size / 1024).toFixed(2)
          });
          fd.append('foto', blob, 'presensi.jpg');
        }
      }
      
      console.log('FormData to send:', {
        hasKeterangan: fd.has('keterangan'),
        hasFoto: fd.has('foto'),
        fotoFieldCount: [...fd.entries()].filter(([k]) => k === 'foto').length
      });
      
      // gunakan callback di parent (Dashboard) agar refresh data tetap terpusat
      onSubmit && onSubmit(fd);
      setKeterangan("");
      setFoto(null);
    } catch (e) {
      console.error('Upload error', e);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">

      <h2 className="text-lg font-semibold mb-3">Presensi</h2>

      {/* Kamera */}
      {!foto ? (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="w-full h-48 object-cover rounded-md border mb-4"
        />
      ) : (
        <img
          src={foto}
          className="w-full h-48 object-cover rounded-md border mb-4"
          alt="foto presensi"
        />
      )}

      <button
        onClick={ambilFoto}
        className="bg-blue-700 text-white w-full py-2 rounded-md mb-3"
      >
        {foto ? "Ambil Ulang Foto" : "Ambil Foto"}
      </button>

      {/* Keterangan */}
      <textarea
        className="w-full border rounded-md p-2 mb-3 text-sm"
        placeholder="Isi keterangan (contoh: sedang kuliah)"
        value={keterangan}
        onChange={(e) => setKeterangan(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={kirimPresensi}
          className="bg-green-600 text-white w-full py-2 rounded-md"
        >
          Absen Masuk
        </button>
        <button
          onClick={async () => {
            try {
              const fd = new FormData();
              fd.append('keterangan', keterangan);
              // Tidak kirim foto saat pulang
              onPulang && onPulang(fd);
              setKeterangan("");
              // JANGAN reset foto agar bisa reuse untuk absen masuk berikutnya jika diinginkan
            } catch (e) {
              console.error('Upload error', e);
            }
          }}
          className="bg-amber-600 text-white w-full py-2 rounded-md"
        >
          Absen Pulang
        </button>
      </div>
    </div>
  );
}
