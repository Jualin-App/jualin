"use client";
import React, { useContext } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo.jsx";
import { AuthContext } from "../../context/AuthProvider.jsx";
import SearchBar from "./SearchBar.jsx";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const pathname = usePathname() || "";
  const showSearch = pathname.startsWith("/dashboard") || pathname.startsWith("/product");

  return (
    <header className="bg-white">
      <div className="w-full px-2 sm:px-4 py-3 flex items-center gap-4 transition-shadow duration-200">
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <Logo />
        </div>
        {showSearch && (
          <div className="flex-1">
            <SearchBar inline />
          </div>
        )}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          {user ? (
            <>
              <a
              href={`/profile/edit?id=${user?.id || user?._id || user?.userId || ''}`}
              className="flex items-center gap-2"
              >
                <img
                  src={user?.avatar || "/ProfilePhoto.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full transition-transform duration-200 hover:scale-105"
                />
                <span className="font-semibold text-gray-800">
                  Hi, {user.name || user.username || "User"}
                </span>
              </a>
              <a
                href="/jual"
                className="px-4 py-2 rounded-2xl bg-[#E83030] text-white font-semibold shadow transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
              >
                Jual
              </a>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="px-4 py-2 rounded-2xl bg-[#E83030] text-white font-semibold shadow transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
              >
                Login
              </a>
              <a
                href="/register"
                className="px-4 py-2 rounded-2xl bg-[#E83030] text-white font-semibold shadow transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
              >
                Register
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
