"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProductsQuery } from "@/hooks/dashboard/useProductsQuery";
import { useFilteredProducts } from "@/hooks/dashboard/useFilteredProducts";
import ProductFilter from "@/components/product/ProductFilter";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { smoothScrollTo } from "@/utils/scroll";
import { getProductImageUrl } from "@/utils/imageHelper";

const formatRupiah = (price) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price || 0);

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, isLoading } = useProductsQuery();
  const productsRef = useRef(null);

  const categoryFromQuery =
    (searchParams.get("category") || "all").toLowerCase();

  const [activeFilter, setActiveFilter] = useState(categoryFromQuery);
  const [searchQuery, setSearchQuery] = useState(
    (searchParams.get("q") || "").trim()
  );

  useEffect(() => {
    setActiveFilter(categoryFromQuery);
    const newQuery = (searchParams.get("q") || "").trim();
    setSearchQuery(newQuery);

    if (newQuery && productsRef.current) {
      smoothScrollTo(productsRef.current, 500, 100);
    }
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
          </div>
        </div>

        <div
          className="flex flex-col gap-4 scroll-mt-24"
          ref={productsRef}
        >
          <ProductFilter
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
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
                      src={getProductImageUrl(p.image)}
                      alt={p.name}
                      className="h-48 w-full object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-200"
                      onError={(e) => {
                        e.target.src = "/ProfilePhoto.png";
                      }}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base text-center mb-2 line-clamp-2">
                    {p.name}
                  </h3>
                  <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">
                    {p.category || p.description || "Tidak ada informasi"}
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



