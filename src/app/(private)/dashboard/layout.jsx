'use client';
import React, { useContext } from 'react';
import Header from './sections/header.jsx';
import { AuthContext } from '../../../context/AuthProvider.jsx';
export default function DashboardLayout({ children }) {
  const { user } = useContext(AuthContext);
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header user={user} />
      {children}
      <footer className="bg-white border-t mt-8 px-4 sm:px-6 py-6 text-center text-gray-600">
        <div className="max-w-6xl mx-auto">
          <p className="font-medium">© {new Date().getFullYear()} Jualin. All rights reserved.</p>
          <div className="mt-2 flex gap-4 justify-center text-sm">
            <a href="/tentang" className="hover:text-gray-800">Tentang</a>
            <a href="/kontak" className="hover:text-gray-800">Kontak</a>
            <a href="/kebijakan-privasi" className="hover:text-gray-800">Privasi</a>
            <a href="/syarat-ketentuan" className="hover:text-gray-800">Syarat</a>
          </div>
        </div>
      </footer>
    </div>
  );
}