"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Topbar from "./TopBar.jsx";

export default function AppChrome({ children }) {
  const pathname = usePathname() || "";
  const hideBoth =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register") ||
    pathname.startsWith("/profile/edit") ||
    pathname.startsWith("/auth/forgot-password") ||
    pathname.startsWith("/auth/reset-password") ||
    pathname === "/404_not_found";
  const isDashboard = pathname.startsWith("/dashboard");
  const hideNavbar = hideBoth;
  const hideFooter = hideBoth;

  return (
    <>
      {!hideNavbar && <Topbar />}
      {!hideNavbar && <Navbar />}
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}
