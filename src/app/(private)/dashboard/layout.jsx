'use client';

import React, { useContext } from 'react';
import Header from './sections/header.jsx';
import { AuthContext } from '../../../context/AuthProvider';

export default function DashboardLayout({ children }) {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header user={user} />
      {children}
    </div>
  );
}
