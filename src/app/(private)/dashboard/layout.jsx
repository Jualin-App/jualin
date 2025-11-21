"use client";

import React from "react";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="w-full">{children}</div>
    </div>
  );
}
