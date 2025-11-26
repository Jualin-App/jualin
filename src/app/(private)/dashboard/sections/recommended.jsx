"use client";
import React, { useState } from "react";
import ProductFilter from "./filter.jsx";

export default function RecommendedSection({ products }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProducts =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.category === activeFilter);

  return (
    <section className="w-full my-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-black">
        Featured Products
      </h2>
      <ProductFilter
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredProducts.map((product, idx) => (
          <a
            key={product.id}
            href={`/product?id=${product.id}`}
            className="bg-white rounded-2xl shadow p-6 flex flex-col items-start transition hover:shadow-lg hover:-translate-y-1 active:scale-95 focus:outline-none"
            style={{ cursor: "pointer" }}
            tabIndex={0}
          >
            <img
              src={
                product.img
                  ? product.img
                  : "https://via.placeholder.com/400x400?text=No+Image"
              }
              alt={product.name}
              className="w-full h-60 object-cover rounded-xl mb-4"
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
