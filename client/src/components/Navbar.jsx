// =========================
// NAVBAR MAGENTA STYLE
// =========================
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setAuthToken } from "../api/axios";

export default function Navbar({ user, notifications = [] }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(Array.isArray(notifications) ? notifications.length : 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest?.("#user-dropdown")) setOpen(false);
      if (!e.target.closest?.("#notif-dropdown")) setNotifOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    if (!notifOpen) {
      setUnreadCount(Array.isArray(notifications) ? notifications.length : 0);
    }
  }, [notifications, notifOpen]);

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    navigate("/login");
  };

  return (
    <>
      {/* Main Navigation - White */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                J
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-slate-800 tracking-[0.15em]">JASAMARGA</h1>
                <p className="text-[10px] text-slate-500 -mt-1 tracking-wider">JALANLAYANG CIKAMPEK</p>
              </div>
            </Link>

            {/* Right Side: Notification + User */}
            <div className="flex items-center gap-4">
              {/* Notification */}
              <div id="notif-dropdown" className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotifOpen((o) => {
                      if (!o) setUnreadCount(0);
                      return !o;
                    });
                  }}
                  className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <h3 className="font-semibold text-slate-800">Notifikasi</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {(!notifications || notifications.length === 0) ? (
                        <div className="px-4 py-6 text-center text-slate-400 text-sm">
                          Tidak ada notifikasi
                        </div>
                      ) : (
                        notifications.map((n, idx) => (
                          <div key={idx} className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0">
                            <p className="font-medium text-sm text-slate-700">{n.title}</p>
                            {n.message && <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div id="user-dropdown" className="relative">
                <button
                  onClick={() => setOpen((o) => !o)}
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white pl-2 pr-3 py-1.5 rounded-full transition"
                >
                  {user?.foto ? (
                    <img src={user.foto} alt={user?.nama} className="w-8 h-8 rounded-full object-cover border-2 border-white/30" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm border-2 border-white/30">
                      {user?.nama?.charAt(0) || "U"}
                    </div>
                  )}
                  <span className="hidden sm:inline font-medium text-sm max-w-[100px] truncate">
                    {user?.nama?.split(" ")[0] || "User"}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-medium text-slate-800 truncate">{user?.nama}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-teal-600" onClick={() => setOpen(false)}>
                      Profil Saya
                    </Link>
                    {user?.role === "admin" && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-teal-600" onClick={() => setOpen(false)}>
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-slate-100" />
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-100">
              <Link to="/" className="block py-2 text-slate-600 hover:text-teal-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to="/profile" className="block py-2 text-slate-600 hover:text-teal-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                Profil
              </Link>
              {user?.role === "admin" && (
                <Link to="/admin" className="block py-2 text-slate-600 hover:text-teal-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Admin Panel
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
