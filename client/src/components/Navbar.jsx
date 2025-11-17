// =========================
// NAVBAR JASAMARGA JALANLAYANG CIKAMPEK
// =========================
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setAuthToken } from "../api/axios";

export default function Navbar({ user, notifications = [] }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(Array.isArray(notifications) ? notifications.length : 0);
  const mergedUser = user;

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest?.('#user-dropdown')) setOpen(false);
      if (!e.target.closest?.('#notif-dropdown')) setNotifOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  // Reset unread count when notifications change (new ones) and dropdown is closed
  useEffect(() => {
    if (!notifOpen) {
      setUnreadCount(Array.isArray(notifications) ? notifications.length : 0);
    }
  }, [notifications, notifOpen]);

  const logout = () => {
    // bersihkan token dan redirect
    localStorage.removeItem('token');
    setAuthToken(null);
    navigate('/login');
  };
  return (
    <nav className="bg-blue-700 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* LEFT: LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex justify-center items-center text-blue-800 font-bold">
            J
          </div>

          <div className="leading-tight">
            <h1 className="text-lg font-bold tracking-wide">JASAMARGA</h1>
            <p className="text-xs">JALANLAYANG CIKAMPEK</p>
          </div>
        </div>

        {/* RIGHT: USER + NOTIF */}
        <div className="flex items-center gap-5">

          {/* Notification icon */}
          <div id="notif-dropdown" className="relative" onClick={(e) => e.stopPropagation()}>
            <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotifOpen(o => {
                  const next = !o;
                  if (next) {
                    // mark all as read when opening
                    setUnreadCount(0);
                  }
                  return next;
                });
              }}
              className="relative bg-white/20 px-3 py-2 rounded-full cursor-pointer hover:bg-white/30 transition"
              aria-haspopup="menu"
              aria-expanded={notifOpen}
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                  {unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <>
                {/* Mobile: bottom sheet overlay */}
                <div className="md:hidden">
                  <div
                    className="fixed inset-0 bg-black/40 z-50"
                    onClick={() => setNotifOpen(false)}
                  />
                  <div
                    className="fixed bottom-0 left-0 right-0 bg-white text-gray-800 rounded-t-xl shadow-lg z-60 max-h-[80vh]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                      <div className="text-sm font-medium">Notifikasi</div>
                      <button
                        aria-label="Tutup"
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setNotifOpen(false)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="max-h-[65vh] overflow-auto">
                      {(!notifications || notifications.length === 0) ? (
                        <div className="px-4 py-3 text-sm text-gray-500">Tidak ada notifikasi</div>
                      ) : (
                        notifications.map((n, idx) => (
                          <div key={idx} className="px-4 py-3 text-sm hover:bg-gray-50">
                            <div className="font-medium wrap-break-word">{n.title || "Info"}</div>
                            {n.message && (
                              <div className="text-gray-600 mt-0.5 whitespace-normal wrap-break-word">{n.message}</div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Desktop: dropdown panel */}
                <div className="hidden md:block">
                  <div className="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded shadow-lg py-2 z-50" onClick={(e) => e.stopPropagation()}>
                    <div className="px-4 pb-2 pt-2 border-b text-sm font-medium">Notifikasi</div>
                    <div className="max-h-64 overflow-auto">
                      {(!notifications || notifications.length === 0) ? (
                        <div className="px-4 py-3 text-sm text-gray-500">Tidak ada notifikasi</div>
                      ) : (
                        notifications.map((n, idx) => (
                          <div key={idx} className="px-4 py-3 text-sm hover:bg-gray-50">
                            <div className="font-medium wrap-break-word">{n.title || "Info"}</div>
                            {n.message && (
                              <div className="text-gray-600 mt-0.5 whitespace-normal wrap-break-word">{n.message}</div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User avatar */}
          <div id="user-dropdown" className="relative">
            <button
              onClick={() => setOpen(o => !o)}
              className="flex items-center gap-3"
              aria-haspopup="menu"
              aria-expanded={open}
            >
              {mergedUser?.foto ? (
                <img
                  src={mergedUser.foto}
                  alt={mergedUser?.nama || "User"}
                  className="w-10 h-10 rounded-full object-cover border border-white/50"
                />
              ) : (
                <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center text-blue-700 font-bold">
                  {mergedUser?.nama ? mergedUser.nama.charAt(0) : "U"}
                </div>
              )}
              <div className="leading-tight text-left hidden md:block">
                <p className="font-medium">{mergedUser?.nama || "User"}</p>
                <p className="text-xs opacity-80">{mergedUser?.email || "email@example.com"}</p>
              </div>
              {/* Chevron icon to indicate dropdown */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={"w-4 h-4 opacity-90 transition-transform duration-200 " + (open ? "rotate-180" : "rotate-0")}
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
              </svg>
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg py-2 z-50">
                {mergedUser?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Profil
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </nav>
  );
}
