"use client";
import React, { useContext } from "react";
import Logo from "./Logo.jsx";
import TextButton from "./TextButton.jsx";
import { AuthContext } from "../../context/AuthProvider.jsx";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4 sm:gap-6 min-w-0">
        <Logo />
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
            <a
              href={`/profile/edit?id=${user?.id || user?._id || user?.userId || ''}`}
              className="flex items-center gap-2"
            >
              <img
                src={user?.avatar || "/ProfilePhoto.png"}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="font-semibold text-gray-800">
                Hi, {user.name || user.username || "User"}
              </span>
            </a>
            <a
              href="/jual"
              className="px-4 py-2 rounded-2xl bg-[#E83030] text-white font-semibold shadow"
            >
              Jual
            </a>
          </>
        ) : (
          <>
            <a
              href="/auth/login"
              className="px-4 py-2 rounded-2xl bg-[#E83030] text-white font-semibold shadow"
            >
              Login
            </a>
            <a
              href="/auth/register"
              className="px-4 py-2 rounded-2xl bg-[#E83030] text-white font-semibold shadow"
            >
              Register
            </a>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
