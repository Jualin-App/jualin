'use client';
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import Header from "./sections/header.jsx";
import SearchBarSection from "./sections/searchbar.jsx";
import BannerSection from "./sections/banner.jsx";
import CategorySection from "./sections/category.jsx";
import RecommendedSection from "./sections/recommended.jsx";
import { banners, categories, products as dummyProducts } from "./dummydata.jsx";
import { productService } from "@/modules/product/service";

function DashboardPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState(dummyProducts);

  useEffect(() => {
    (async () => {
      try {
        const res = await productService.list();
        console.log("[dashboard] products api raw:", res);
        const items = Array.isArray(res) ? res : res?.data || res?.items || [];
        const normalized = items.map((item) => ({
          user: item?.user?.username || item?.seller?.name || "User",
          time: item?.created_at || item?.updated_at || "",
          img: item?.image_url || item?.image || item?.thumbnail || "",
          name: item?.name || item?.title || "Product",
          price: item?.price ? `Rp. ${item.price}` : "Rp. 0,00",
          condition: item?.condition || item?.status || "",
        }));
        console.log("[dashboard] products normalized:", normalized);
        if (normalized.length) setProducts(normalized);
      } catch (err) {
        console.error("[dashboard] products fetch error:", err);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header user={user} />
      <SearchBarSection />
      <main className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <BannerSection banners={banners} />
        <CategorySection categories={categories} />
        <RecommendedSection products={products} />
      </main>
    </div>
  );
}

export default DashboardPage;