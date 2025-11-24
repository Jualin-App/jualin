'use client';
import React, { useContext } from 'react';
import Logo from './Logo.jsx';
import TextButton from './TextButton.jsx';
import { AuthContext } from '../../context/AuthProvider.jsx';

const Navbar = () => {
  const { user, demoLogin } = useContext(AuthContext);

  return (
    <header className="bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4 sm:gap-6 min-w-0">
        <Logo size="small" />
        <nav className="flex gap-3 sm:gap-6 text-gray-800 font-semibold flex-wrap">
          <TextButton href="/">Home</TextButton>
          <TextButton href="/kategori/elektronik">Elektronik</TextButton>
          <TextButton href="/kategori/fashion">Fashion</TextButton>
          <TextButton href="/kategori/daily">Daily</TextButton>
          <TextButton href="/kategori/skincare">Skincare</TextButton>
        </nav>
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        {user ? (
          <>
            <a href="/profile/edit" className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
              <img
                src={user.avatar || 'https://i.pravatar.cc/32'}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="font-semibold text-gray-800">
                Profile
              </span>
            </a>
            <a href="/jual" className="px-4 py-2 rounded-2xl bg-[#E83030] text-white font-semibold shadow">
              Jual
            </a>
          </>
        ) : (
          <>
            <button 
              onClick={demoLogin} 
              className="px-3 py-2 rounded-2xl bg-blue-500 text-white text-sm font-semibold shadow hover:bg-blue-600"
            >
              Demo Login
            </button>
            <a href="/login" className="px-4 py-2 rounded-2xl border border-gray-300 font-semibold">
              Login
            </a>
            <a href="/register" className="px-4 py-2 rounded-2xl bg-[#E83030] text-white font-semibold shadow">
              Register
            </a>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;