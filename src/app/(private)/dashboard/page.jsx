"use client";
import React from "react";
import BannerSection from "./sections/banner.jsx";
import CategorySection from "./sections/category.jsx";
import RecommendedSection from "./sections/recommended.jsx";
import { banners, categories, products } from "./dummydata.jsx";
import SearchBarSection from "./sections/searchbar.jsx";

function DashboardPage() {
  return (
    <>
      <main className="bg-[#fafafa]">
        <SearchBarSection />
        <BannerSection banners={banners} />
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <CategorySection categories={categories} />
          <RecommendedSection products={products} />
        </div>
      </main>
    </>
  );
}

export default DashboardPage;
