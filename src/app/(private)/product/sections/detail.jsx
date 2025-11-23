"use client";
import React from "react";

export default function ProductDetailSection({ product }) {
  if (!product) {
    return (
      <div className="text-center py-12">No product selected or not found.</div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start bg-white rounded-2xl shadow p-6">
      <img
        src={
          product.img
            ? product.img
            : "https://via.placeholder.com/400x400?text=No+Image"
        }
        alt={product.name}
        className="w-full md:w-1/2 h-80 object-cover rounded-2xl shadow"
      />
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2 text-blue-700">
          {product.brand || product.category}
        </h1>
        <h2 className="text-2xl font-semibold mb-4 text-black">
          {product.name}
        </h2>
        <p className="text-gray-600 mb-6">{product.description}</p>
        <span className="block font-bold text-xl text-black mb-6">
          Rp {product.price}
        </span>
        <button className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-red-600 transition">
          Buy Now!
        </button>
      </div>
    </div>
  );
}
