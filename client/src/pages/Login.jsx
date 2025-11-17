// =========================
// LOGIN PAGE
// =========================
import React, { useState } from "react";
import AuthAPI from "../api/AuthAPI";
import { setAuthToken } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await AuthAPI.login({ email, password });
      const token = localStorage.getItem("token");
      setAuthToken(token);
      navigate("/");
    } catch (err) {
      setError(err.message || err.error || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-6 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4">Masuk</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-3 text-sm">{error}</div>}
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3 text-sm"
          placeholder="zaky@example.com"
          required
        />
        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4 text-sm"
          placeholder="••••••••"
          required
        />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded py-2 disabled:opacity-50">
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}
