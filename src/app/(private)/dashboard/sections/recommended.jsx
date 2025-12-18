"use client";
import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductFilter from "./filter.jsx";

export default function RecommendedSection({ products, isLoading = false }) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const VISIBLE_LIMIT = 6;

  const filteredProducts = useMemo(() => {
    const base =
      activeFilter === "all"
        ? products
        : products.filter((p) => p.category === activeFilter);
    if (!q) return base;
    return base.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const brand = (p.brand || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      return (
        name.includes(q) || brand.includes(q) || desc.includes(q)
      );
    });
  }, [products, activeFilter, q]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, VISIBLE_LIMIT),
    [filteredProducts]
  );

  const handleSeeAll = () => {
    const params = new URLSearchParams();
    if (activeFilter && activeFilter !== "all") {
      params.set("category", activeFilter);
    }
    const query = params.toString();
    router.push(query ? `/products?${query}` : "/products");
  };

  if (isLoading) {
    return (
      <section className="w-full my-8 animate-fade-in">
        <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
        <div className="flex justify-center gap-4 mb-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow p-6 flex flex-col items-start"
            >
              <div className="w-full h-60 bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full my-8 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-center text-black">
        Produk yang mungkin kamu suka
      </h2>
      <ProductFilter
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
      <div className="w-full flex justify-center sm:justify-end mb-4">
        <button
          type="button"
          onClick={handleSeeAll}
          className="text-sm text-brand-red font-semibold hover:text-red-600 hover:opacity-90 hover:drop-shadow-sm transform hover:scale-105 transition-all duration-150"
        >
          Lihat semua
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {visibleProducts.map((product, idx) => (
          <a
            key={product.id}
            href={`/product/${product.id}`}
            className="group bg-white rounded-2xl shadow p-6 flex flex-col items-start transition-all duration-200 ease-out hover:shadow-xl hover:-translate-y-1 active:scale-95 focus:outline-none"
            style={{ cursor: "pointer" }}
            tabIndex={0}
          >
            <img
              src={product.img ? product.img : "https://via.placeholder.com/400x400?text=No+Image"}
              alt={product.name || "Product image"}
              className="w-full h-60 object-cover rounded-xl mb-4 transition-transform duration-200 group-hover:scale-[1.02]"
            />
            <span className="font-bold text-blue-700 uppercase text-sm mb-2 tracking-wide">
              {product.brand || product.category}
            </span>
            <h3 className="font-semibold text-xl mb-1 text-black">
              {product.name}
            </h3>
            <p className="text-gray-500 text-base mb-2">
              {product.description}
            </p>
            <span className="font-bold text-lg text-black">
              Rp {product.price}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
