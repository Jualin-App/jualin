"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "lucide-react";
import { useProductsQuery } from "@/hooks/dashboard/useProductsQuery";
import ProductFilter from "@/components/product/ProductFilter";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/ui/Pagination";
import { smoothScrollTo } from "@/utils/scroll";
import { getProductImageUrl } from "@/utils/imageHelper";
import { formatCurrency } from "@/utils/formatters/currency";



export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productsRef = useRef(null);

  const categoryFromQuery =
    (searchParams.get("category") || "all").toLowerCase();

  const [activeFilter, setActiveFilter] = useState(categoryFromQuery);
  const [searchQuery, setSearchQuery] = useState(
    (searchParams.get("q") || "").trim()
  );

  // State for pagination
  const [page, setPage] = useState(1);

  useEffect(() => {
    setActiveFilter(categoryFromQuery);
    const newQuery = (searchParams.get("q") || "").trim();
    setSearchQuery(newQuery);

    if (newQuery && productsRef.current) {
      smoothScrollTo(productsRef.current, 500, 100);
    }

    // Reset to page 1 when filters change (category or search)
    setPage(1);
  }, [categoryFromQuery, searchParams]);

  // Construct query params for server-side fetching
  const queryParams = {
    page,
    per_page: 6, // Limit per requirement
    name: searchQuery || undefined, // Send name filter if exists
    category: activeFilter !== 'all' ? activeFilter : undefined, // Send category if not 'all'
  };

  const { data, isLoading } = useProductsQuery(queryParams);
  const { products, totalPages, currentPage } = data || { products: [], totalPages: 1, currentPage: 1 };

  const handleCardClick = (id) => {
    router.push(`/product/${id}`);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Scroll to top of product grid when page changes
    if (productsRef.current) {
      smoothScrollTo(productsRef.current, 500, 100);
    }
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
          ) : products.length === 0 ? (
            <div className="border-2 border-dashed rounded-2xl p-8 text-center text-gray-500">
              <p className="font-medium mb-2">Produk tidak ditemukan</p>
              <p className="text-sm">
                Coba ubah kategori atau kata kunci pencarianmu.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
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
                    <div className="flex justify-center mb-3">
                      <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                        <User size={12} className="text-red-600" />
                        <span className="text-xs text-red-800 font-medium">
                          {p.seller?.username || "Unknown"}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <span className="px-4 py-2 bg-brand-red text-white rounded-full text-sm font-medium">
                        {formatCurrency(p.price)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Pagination Component */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}




