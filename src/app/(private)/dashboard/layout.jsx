'use client';

import React, { useContext } from 'react';
import Header from './sections/header.jsx';
import TopBar from './sections/topbar.jsx';
import { AuthContext } from '../../../context/AuthProvider.jsx';

export default function DashboardLayout({ children }) {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <TopBar />
      <Header user={user} />
      {children}
    </div>
  );
}
