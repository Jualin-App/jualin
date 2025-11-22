'use client';
import React, { useEffect, useState } from "react";
import SearchBarSection from "./sections/searchbar.jsx";
import BannerSection from "./sections/banner.jsx";
import CategorySection from "./sections/category.jsx";
import RecommendedSection from "./sections/recommended.jsx";
import { banners, categories, products as dummyProducts } from "./dummydata.jsx";
import { productService } from "@/modules/product/service";

function DashboardPage() {
  const [products, setProducts] = useState(dummyProducts);

  useEffect(() => {
    (async () => {
      try {
        const res = await productService.list();
        console.log("[dashboard] products api raw:", res);
        // Ensure items is always an array
        let items = [];
        if (Array.isArray(res)) {
          items = res;
        } else if (res?.data) {
          items = Array.isArray(res.data) ? res.data : [];
        } else if (res?.items) {
          items = Array.isArray(res.items) ? res.items : [];
        } else if (res && typeof res === 'object') {
          // If res is an object but not array, try to extract array from it
          const possibleArray = Object.values(res).find(val => Array.isArray(val));
          items = possibleArray || [];
        }
        
        if (!Array.isArray(items)) {
          console.warn("[dashboard] items is not an array, using empty array:", items);
          items = [];
        }
        
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
    <>
      <SearchBarSection />
      <main className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <BannerSection banners={banners} />
        <CategorySection categories={categories} />
        <RecommendedSection products={products} />
      </main>
    </>
  );
}

export default DashboardPage;