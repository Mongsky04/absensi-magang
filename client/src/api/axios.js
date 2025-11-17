// =========================
// AXIOS INSTANCE
// =========================
import axios from "axios";

// Determine base URL based on environment
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    // Client-side: use relative path or detect from window.location
    const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (isDev) {
      return "http://localhost:5000/api";
    } else {
      // Production: use the same origin as the frontend
      return `${window.location.origin}/api`;
    }
  }
  // Server-side (shouldn't happen in client app)
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
