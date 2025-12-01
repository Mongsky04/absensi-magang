// =========================
// USER API
// =========================
import api from "./axios";

const UserAPI = {
  // =========================
  // GET PROFILE USER LOGIN
  // =========================
  getProfile: async () => {
    try {
      const res = await api.get("/user/me");
      return res.data.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  // =========================
  // UPDATE PROFILE (FOTO)
  // =========================
  updateProfile: async (payload) => {
    try {
      const res = await api.put("/user/me", payload);
      return res.data.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  // =========================
  // GET MENTORS (isMentor=true)
  // =========================
  getMentors: async () => {
    try {
      const res = await api.get("/user/mentors");
      return res.data.data || [];
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  // =========================
  // ADMIN: GET ALL USERS
  // =========================
  getAllUsers: async () => {
    try {
      const res = await api.get("/user/all");
      return res.data.data || [];
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  // =========================
  // ADMIN: CREATE USER
  // =========================
  createUserAdmin: async (payload) => {
    try {
      const res = await api.post("/user", payload);
      return res.data.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  // =========================
  // ADMIN: UPDATE USER
  // =========================
  updateUserAdmin: async (id, payload) => {
    try {
      const res = await api.put(`/user/${id}`, payload);
      return res.data.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  // =========================
  // ADMIN: DELETE USER
  // =========================
  deleteUserAdmin: async (id) => {
    try {
      const res = await api.delete(`/user/${id}`);
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },
};

export default UserAPI;
