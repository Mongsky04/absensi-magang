// =========================
// PROFILE CARD JJC
// =========================
import React from "react";

export default function ProfileCard({ user }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">

      <div className="flex items-center gap-4">
        {user?.foto ? (
          <img
            src={user.foto}
            alt={user?.nama || "User"}
            className="w-16 h-16 rounded-full object-cover border"
          />
        ) : (
          <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex justify-center items-center text-2xl font-bold">
            {user?.nama ? user.nama.charAt(0) : "U"}
          </div>
        )}

        <div>
          <h3 className="font-bold text-lg">{user?.nama}</h3>
          <p className="text-sm text-gray-600">{user?.email}</p>
          <p className="text-sm mt-1 text-blue-700 font-semibold">
            {user?.role}
          </p>
          <p className="text-sm text-gray-700">{user?.perusahaan}</p>
          <p className="text-sm text-gray-700 mt-1">
            <span className="font-medium">Mentor:</span> {user?.mentor || "-"}
          </p>
        </div>
      </div>

    </div>
  );
}
