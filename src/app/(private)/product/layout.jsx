'use client';
import React, { useContext }from "react";
import Topbar from "./sections/topbar.jsx";
import Header from "./sections/header.jsx";
import { AuthContext } from '../../../context/AuthProvider.jsx';

export default function ProductLayout({ children }) {
    const { user } = useContext(AuthContext);
    return (
        <main className="bg-[#fafafa] min-h-screen">
        <Topbar />
        <Header user={user}/>
        <div className="w-full">
            {children}
        </div>
        </main>
    );
}