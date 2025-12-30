// =========================
// HOLIDAY CONFIG & UTILITIES
// =========================

/**
 * Daftar Hari Libur Nasional Indonesia 2025
 * Format: YYYY-MM-DD
 * Sumber: Kalender resmi pemerintah
 */
export const NATIONAL_HOLIDAYS_2025 = [
  // Januari 2025
  "2025-01-01", // Tahun Baru 2025
  
  // Februari 2025
  "2025-02-12", // Isra Miraj
  
  // Maret 2025
  "2025-03-29", // Hari Suci Nyepi (Tahun Baru Saka 1947)
  "2025-03-31", // Awal Ramadhan 1446 H (jika diliburkan)
  
  // April 2025
  "2025-04-01", // Hari Raya Idul Fitri 1446 H
  "2025-04-02", // Hari Raya Idul Fitri 1446 H
  "2025-04-03", // Cuti Bersama Idul Fitri
  "2025-04-04", // Cuti Bersama Idul Fitri
  "2025-04-18", // Wafat Yesus Kristus
  
  // Mei 2025
  "2025-05-01", // Hari Buruh Internasional
  "2025-05-02", // Cuti Bersama (jika ada)
  "2025-05-12", // Kenaikan Yesus Kristus
  "2025-05-29", // Hari Raya Waisak 2569
  
  // Juni 2025
  "2025-06-01", // Hari Lahir Pancasila
  "2025-06-07", // Hari Raya Idul Adha 1446 H
  
  // Juli 2025
  "2025-07-28", // Tahun Baru Islam 1447 H
  
  // Agustus 2025
  "2025-08-17", // Hari Kemerdekaan RI
  
  // September 2025
  "2025-09-26", // Maulid Nabi Muhammad SAW
  
  // Desember 2025
  "2025-12-25", // Hari Raya Natal
  "2025-12-26", // Cuti Bersama Natal (jika ada)
];

/**
 * Daftar Hari Libur Nasional Indonesia 2024
 * Untuk backward compatibility jika ada data tahun sebelumnya
 */
export const NATIONAL_HOLIDAYS_2024 = [
  "2024-01-01", // Tahun Baru
  "2024-02-08", // Isra Miraj
  "2024-02-10", // Tahun Baru Imlek
  "2024-03-11", // Hari Suci Nyepi
  "2024-03-29", // Wafat Yesus Kristus
  "2024-03-31", // Awal Ramadhan (jika diliburkan)
  "2024-04-10", // Idul Fitri
  "2024-04-11", // Idul Fitri
  "2024-04-12", // Cuti Bersama
  "2024-04-13", // Cuti Bersama
  "2024-05-01", // Hari Buruh
  "2024-05-09", // Kenaikan Yesus Kristus
  "2024-05-10", // Cuti Bersama
  "2024-05-23", // Hari Raya Waisak
  "2024-06-01", // Hari Lahir Pancasila
  "2024-06-17", // Idul Adha
  "2024-07-07", // Tahun Baru Islam
  "2024-08-17", // Kemerdekaan RI
  "2024-09-16", // Maulid Nabi Muhammad
  "2024-12-25", // Natal
  "2024-12-26", // Cuti Bersama
];

/**
 * Daftar Hari Libur Nasional Indonesia 2026
 * Untuk planning ke depan (masih perlu konfirmasi resmi)
 */
export const NATIONAL_HOLIDAYS_2026 = [
  "2026-01-01", // Tahun Baru
  // ... tambahkan sesuai kalender resmi ketika sudah dirilis
];

// Gabungkan semua hari libur dalam satu Set untuk lookup cepat
const allHolidays = new Set([
  ...NATIONAL_HOLIDAYS_2024,
  ...NATIONAL_HOLIDAYS_2025,
  ...NATIONAL_HOLIDAYS_2026,
]);

/**
 * Cek apakah suatu tanggal adalah hari libur nasional
 * @param {Date} date - Tanggal yang akan dicek
 * @returns {boolean} - true jika hari libur nasional
 */
export const isNationalHoliday = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;
  
  return allHolidays.has(dateString);
};

/**
 * Cek apakah suatu tanggal adalah hari weekend (Sabtu atau Minggu)
 * @param {Date} date - Tanggal yang akan dicek
 * @returns {boolean} - true jika Sabtu atau Minggu
 */
export const isWeekend = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }
  
  const dayOfWeek = date.getDay();
  // 0 = Minggu, 6 = Sabtu
  return dayOfWeek === 0 || dayOfWeek === 6;
};

/**
 * Cek apakah suatu tanggal adalah hari kerja
 * (Bukan weekend dan bukan hari libur nasional)
 * @param {Date} date - Tanggal yang akan dicek
 * @returns {boolean} - true jika hari kerja
 */
export const isWorkingDay = (date) => {
  return !isWeekend(date) && !isNationalHoliday(date);
};

/**
 * Hitung jumlah hari kerja dalam suatu range tanggal
 * @param {Date} startDate - Tanggal mulai
 * @param {Date} endDate - Tanggal akhir
 * @returns {number} - Jumlah hari kerja
 */
export const countWorkingDays = (startDate, endDate) => {
  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    return 0;
  }
  
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    if (isWorkingDay(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};

/**
 * Dapatkan nama hari libur (jika ada)
 * @param {Date} date - Tanggal yang akan dicek
 * @returns {string|null} - Nama hari libur atau null
 */
export const getHolidayName = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return null;
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;
  
  // Map tanggal ke nama libur
  const holidayNames = {
    // 2025
    "2025-01-01": "Tahun Baru 2025",
    "2025-02-12": "Isra Miraj",
    "2025-03-29": "Hari Suci Nyepi",
    "2025-03-31": "Awal Ramadhan",
    "2025-04-01": "Idul Fitri",
    "2025-04-02": "Idul Fitri",
    "2025-04-03": "Cuti Bersama Idul Fitri",
    "2025-04-04": "Cuti Bersama Idul Fitri",
    "2025-04-18": "Wafat Yesus Kristus",
    "2025-05-01": "Hari Buruh",
    "2025-05-02": "Cuti Bersama",
    "2025-05-12": "Kenaikan Yesus Kristus",
    "2025-05-29": "Hari Raya Waisak",
    "2025-06-01": "Hari Lahir Pancasila",
    "2025-06-07": "Idul Adha",
    "2025-07-28": "Tahun Baru Islam",
    "2025-08-17": "Hari Kemerdekaan RI",
    "2025-09-26": "Maulid Nabi Muhammad",
    "2025-12-25": "Hari Raya Natal",
    "2025-12-26": "Cuti Bersama Natal",
    
    // 2024
    "2024-01-01": "Tahun Baru 2024",
    "2024-02-08": "Isra Miraj",
    "2024-02-10": "Tahun Baru Imlek",
    "2024-03-11": "Hari Suci Nyepi",
    "2024-03-29": "Wafat Yesus Kristus",
    "2024-04-10": "Idul Fitri",
    "2024-04-11": "Idul Fitri",
    "2024-04-12": "Cuti Bersama Idul Fitri",
    "2024-04-13": "Cuti Bersama Idul Fitri",
    "2024-05-01": "Hari Buruh",
    "2024-05-09": "Kenaikan Yesus Kristus",
    "2024-05-23": "Hari Raya Waisak",
    "2024-06-01": "Hari Lahir Pancasila",
    "2024-06-17": "Idul Adha",
    "2024-07-07": "Tahun Baru Islam",
    "2024-08-17": "Hari Kemerdekaan RI",
    "2024-09-16": "Maulid Nabi Muhammad",
    "2024-12-25": "Hari Raya Natal",
    "2024-12-26": "Cuti Bersama Natal",
  };
  
  return holidayNames[dateString] || null;
};

export default {
  NATIONAL_HOLIDAYS_2025,
  NATIONAL_HOLIDAYS_2024,
  NATIONAL_HOLIDAYS_2026,
  isNationalHoliday,
  isWeekend,
  isWorkingDay,
  countWorkingDays,
  getHolidayName,
};
