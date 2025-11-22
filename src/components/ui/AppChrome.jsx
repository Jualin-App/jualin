'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function AppChrome({ children }) {
  const pathname = usePathname() || '';
  const hideBoth = pathname.startsWith('/login')
    || pathname.startsWith('/register')
    || pathname.startsWith('/auth/login')
    || pathname.startsWith('/auth/register')
    || pathname.startsWith('/profile/edit');
  // Hide navbar for dashboard and all private routes (they have their own headers)
  const isPrivateRoute = pathname.startsWith('/dashboard') 
    || pathname.startsWith('/profile');
  const hideNavbar = hideBoth || isPrivateRoute;
  const hideFooter = hideBoth;

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}