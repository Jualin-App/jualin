'use client';
import React from "react";
import Logo from "../../../../components/ui/Logo.jsx";
import Button from "../../../../components/ui/Button.jsx";
import TextButton from "../../../../components/ui/TextButton.jsx";

function Header({ user }) {
  return (
    <header className="bg-white border-b px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-y-2">
      <div className="flex items-center gap-4 sm:gap-6 min-w-0">
        <Logo />
        <nav className="flex gap-3 sm:gap-6 text-gray-800 font-semibold flex-wrap">
          <TextButton href="#">Elektronik</TextButton>
          <TextButton href="#">Fashion</TextButton>
          <TextButton href="#">Daily</TextButton>
          <TextButton href="#">Skincare</TextButton>
        </nav>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 overflow-hidden">
        {user ? (
          //untuk routingnya harus diupdate setelah backend siap
          <>
            <a href={`/profile/${user.username || user.id}`} className="flex items-center gap-2 group">
              <img
                src={user.avatar || "https://i.pravatar.cc/32"}
                alt="avatar"
                className="w-8 h-8 rounded-full flex-shrink-0 cursor-pointer group-hover:ring-2 group-hover:ring-red-400 transition"
              />
              <span className="font-semibold text-gray-800 whitespace-nowrap cursor-pointer group-hover:text-red-500 transition">
                Hi, {user.name || user.username || "User"}
              </span>
            </a>
            <Button as="a" href="/jual" color="danger" className="px-4 sm:px-5 py-2 font-semibold shadow flex-shrink-0 max-w-fit">Jual</Button>
          </>
        ) : (
          <>
            <TextButton href="/login">Login</TextButton>
            <TextButton href="/register">Register</TextButton>
            <Button as="a" href="/jual" color="danger" className="px-4 sm:px-5 py-2 font-semibold shadow flex-shrink-0 max-w-fit">Jual</Button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;