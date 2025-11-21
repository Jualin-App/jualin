'use client';

import React from "react";
import TextButton from "../../../../components/ui/TextButton.jsx";
import Logo from "../../../../components/ui/Logo.jsx";
import Button from "../../../../components/ui/Button.jsx";

export default function Header({ user }) {
  return (
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Logo />
        <nav className="flex gap-6 text-gray-800 font-semibold">
          <TextButton href="#">Category</TextButton>
          <TextButton href="#">Woman</TextButton>
          <TextButton href="#">Man</TextButton>
          <TextButton href="#">Kids</TextButton>
          <TextButton href="#">Sport</TextButton>
          <TextButton href="#">Sale</TextButton>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Button as="a" href="/auth/login" color="danger" className="px-5 py-2 font-semibold shadow">
          Login/Sign up
        </Button>
        <button className="bg-gray-100 rounded-full p-2">
          <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="9" cy="9" r="7" /><line x1="15" y1="15" x2="19" y2="19" /></svg>
        </button>
      </div>
    </header>
  );
}