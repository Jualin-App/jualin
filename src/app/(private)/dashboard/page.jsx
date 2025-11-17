'use client';
import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider.jsx";
import Header from "./sections/header.jsx";
import SearchBarSection from "./sections/searchbar.jsx";
import BannerSection from "./sections/banner.jsx";
import CategorySection from "./sections/category.jsx";
import RecommendedSection from "./sections/recommended.jsx";
import { banners, categories, products } from "./dummydata.jsx";

function DashboardPage() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header user={user} />
      <SearchBarSection />
      <main className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <BannerSection banners={banners}/>
        <CategorySection categories={categories} />
        <RecommendedSection products={products}/>
      </main>
    </div>
  );
}

export default DashboardPage;