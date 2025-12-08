// =========================
// AXIOS INSTANCE
// =========================
import axios from "axios";

// Determine base URL based on environment
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    // Check if we're in development environment
    const isDev = window.location.hostname === "localhost" || 
                  window.location.hostname === "127.0.0.1" ||
                  window.location.hostname === "10.121.20.89";
    
    if (isDev) {
      // Development: use local backend
      return "http://localhost:5000/api";
    } else {
      // Production: use Render backend URL
      return "https://absensi-magang.onrender.com/api";
    }
  }
  // Default fallback
  return "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// =========================
// SET AUTH TOKEN
// =========================
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = "Bearer " + token;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// =========================
// Interceptor: auto-logout on 401
// =========================
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // clear token and redirect to login
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      if (typeof window !== "undefined") {
        const loginUrl = "/login";
        if (window.location.pathname !== loginUrl) {
          window.location.href = loginUrl;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
