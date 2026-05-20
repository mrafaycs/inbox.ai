'use client';
import axios from 'axios';
import React from 'react';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const logout = async () => {
    try {
      await axios.get("/api/gmail/disconnect");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm text-black">
      <h1 className="text-xl font-semibold tracking-tight select-none">
        Inbox<span className="text-gray-500">.ai</span>
      </h1>

      <button
        onClick={logout}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-full transition cursor-pointer"
        aria-label="Logout"
        title="Logout"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </nav>
  );
}
