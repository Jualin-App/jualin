"use client";
import { useEffect, useState } from "react";
import BannerSection from "./sections/banner.jsx";
import RecommendedSection from "./sections/recommended.jsx";
import { banners } from "../../dummydata.jsx";
import { fetchProducts } from "../../../modules/product/service.js";

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to load products:", err);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <main className="bg-white">
      <BannerSection banners={banners} isLoading={isLoading} />
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <RecommendedSection products={products} isLoading={isLoading} />
      </div>
    </main>
  );
}
