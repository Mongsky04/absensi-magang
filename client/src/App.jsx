// =========================
// APP ROOT (ROUTING UTAMA)
// =========================
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import LaporAbsen from "./pages/LaporAbsen";
import HubungiAdmin from "./pages/HubungiAdmin";
import { setAuthToken } from "./api/axios";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromQuery = params.get("token");
    if (tokenFromQuery) {
      localStorage.setItem("token", tokenFromQuery);
      setAuthToken(tokenFromQuery);
      // bersihkan query param token dari URL tanpa reload
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url);
    }

    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/hubungi-admin" element={<HubungiAdmin />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lapor-absen"
          element={
            <ProtectedRoute>
              <LaporAbsen />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
