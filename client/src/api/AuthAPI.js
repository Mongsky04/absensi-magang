// =========================
// AUTH API
// =========================
import api, { setAuthToken } from "./axios";

const AuthAPI = {
  // =========================
  // LOGIN
  // =========================
  login: async (payload) => {
    try {
      const res = await api.post("/auth/login", payload);

      const token = res.data.token;
      localStorage.setItem("token", token);

      setAuthToken(token);

      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  // =========================
  // LOGOUT
  // =========================
  logout: () => {
    localStorage.removeItem("token");
    setAuthToken(null);
  },
};

export default AuthAPI;
