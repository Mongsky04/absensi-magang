const axios = require('axios');

(async () => {
  try {
    const base = 'http://localhost:5000/api';
    const email = 'zaky@example.com';
    const password = 'password123';
    const login = await axios.post(base + '/auth/login', { email, password });
    const token = login.data.token;
    const api = axios.create({ baseURL: base, headers: { Authorization: 'Bearer ' + token } });
    const me = await api.get('/user/me');
    const riwayat = await api.get('/absensi/riwayat');
    console.log('User:', me.data.data.email);
    console.log('Riwayat items:', riwayat.data.data.length);
    if (riwayat.data.data[0]) {
      console.log('Latest item sample:', {
        tanggal: riwayat.data.data[0].tanggal,
        status: riwayat.data.data[0].status,
        jamMasuk: riwayat.data.data[0].jamMasuk,
        jamPulang: riwayat.data.data[0].jamPulang,
      });
    }
  } catch (e) {
    console.error('Test failed:', e.response?.data || e.message);
    process.exit(1);
  }
})();
