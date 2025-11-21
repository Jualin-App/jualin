'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Shoes", value: "shoes" },
  { label: "Hoodie", value: "hoodie" },
  { label: "T-shirt", value: "tshirt" },
  { label: "Beauty Product", value: "beauty" },
  { label: "Watches", value: "watches" },
];

export default function RecommendedSection({ products }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const router = useRouter();

  const filteredProducts =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.category === activeFilter);

  const handleProductClick = (product) => {
    router.push(`/product/${product.slug}`);
  };

  return (
    <section className="w-full my-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-black">What do you like?</h2>
      <div className="flex gap-3 justify-center mb-6 flex-wrap">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            className={`rounded-full px-4 py-1 font-semibold transition ${
              activeFilter === filter.value
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredProducts.map((product, idx) => (
          <button
            key={idx}
            className="bg-white rounded-2xl shadow p-6 flex flex-col items-start transition hover:shadow-lg hover:-translate-y-1 active:scale-95 focus:outline-none"
            style={{ cursor: "pointer" }}
            onClick={() => handleProductClick(product)}
            tabIndex={0}
          >
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-60 object-cover rounded-xl mb-4"
            />
            <span className="font-bold text-blue-700 uppercase text-sm mb-2 tracking-wide">{product.brand}</span>
            <h3 className="font-semibold text-xl mb-1 text-black">{product.name}</h3>
            <p className="text-gray-500 text-base mb-2">{product.description}</p>
            <span className="font-bold text-lg text-black">Rp {product.price}</span>
          </button>
        ))}
      </div>
    </section>
  );
}