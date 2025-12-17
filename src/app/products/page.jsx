"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/dashboard/useProducts";
import { useFilteredProducts } from "@/hooks/dashboard/useFilteredProducts";
import ProductFilter from "../(private)/dashboard/sections/filter.jsx";

const formatRupiah = (price) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price || 0);

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, isLoading } = useProducts();

  const categoryFromQuery =
    (searchParams.get("category") || "all").toLowerCase();

  const [activeFilter, setActiveFilter] = useState(categoryFromQuery);
  const [searchQuery, setSearchQuery] = useState(
    (searchParams.get("q") || "").trim()
  );

  useEffect(() => {
    setActiveFilter(categoryFromQuery);
    setSearchQuery((searchParams.get("q") || "").trim());
  }, [categoryFromQuery, searchParams]);

  const { filteredProducts } = useFilteredProducts({
    products,
    categoryFilter: activeFilter,
    searchQuery,
  });

  const handleCardClick = (id) => {
    router.push(`/product/${id}`);
  };

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Semua Produk
            </h1>
            <p className="text-sm text-gray-600">
              Jelajahi semua produk yang tersedia sesuai kategori pilihanmu.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ProductFilter
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />

          {isLoading ? (
            <div className="text-center text-gray-500 py-10">
              Memuat produk...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="border-2 border-dashed rounded-2xl p-8 text-center text-gray-500">
              <p className="font-medium mb-2">Produk tidak ditemukan</p>
              <p className="text-sm">
                Coba ubah kategori atau kata kunci pencarianmu.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleCardClick(p.id)}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-200 text-left group"
                >
                  <div className="flex justify-center mb-4">
                    <img
                      src={p.img || p.image || "/ProfilePhoto.png"}
                      alt={p.name}
                      className="h-48 w-full object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-200"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base text-center mb-2 line-clamp-2">
                    {p.name}
                  </h3>
                  <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">
                    {p.size || p.brand || p.category || "Tidak ada informasi"}
                  </p>
                  <div className="flex justify-center">
                    <span className="px-4 py-2 bg-brand-red text-white rounded-full text-sm font-medium">
                      {formatRupiah(p.price)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}


