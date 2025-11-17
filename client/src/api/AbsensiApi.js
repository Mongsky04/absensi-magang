import api from "./axios";

const AbsensiAPI = {
  // Absen masuk
  masuk: async (formData) => {
    try {
      console.log('Sending absen masuk request with FormData');
      // Don't set Content-Type header - let axios handle FormData automatically
      const res = await api.post("/absensi/masuk", formData);
      console.log('Absen masuk response:', res.data);
      return res.data.data;
    } catch (err) {
      console.error('Absen masuk error:', err.response?.data || err);
      throw err.response?.data || err;
    }
  },

  // Absen pulang
  pulang: async (formData) => {
    try {
      console.log('Sending absen pulang request with FormData');
      const res = await api.post("/absensi/pulang", formData);
      console.log('Absen pulang response:', res.data);
      return res.data.data;
    } catch (err) {
      console.error('Absen pulang error:', err.response?.data || err);
      throw err.response?.data || err;
    }
  },

  // Riwayat user login
  getRiwayat: async () => {
    try {
      const res = await api.get("/absensi/riwayat");
      return res.data.data || [];
    } catch (err) {
      throw err.response?.data || err;
    }
  },
};

export default AbsensiAPI;
