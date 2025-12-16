"use client";
import { Suspense } from "react";
import BannerSection from "./sections/banner.jsx";
import RecommendedSection from "./sections/recommended.jsx";
import { banners } from "../../dummydata.jsx";
import { useProducts } from "@/hooks/dashboard/useProducts";

export default function DashboardPage() {
  const { products, isLoading } = useProducts();

  return (
    <main className="bg-white">
      <BannerSection banners={banners} isLoading={isLoading} />
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <Suspense fallback={<div className="w-full my-8 text-center">Loading...</div>}>
          <RecommendedSection products={products} isLoading={isLoading} />
        </Suspense>
      </div>
    </main>
  );
}
