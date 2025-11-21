'use client';
import React from "react";
import { useParams } from "next/navigation";
import { products } from "../../dashboard/dummydata.jsx";
import RecommendedSection from "../sections/recommended.jsx";
import SearchBarSection from "../sections/searchbar.jsx";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);

  if (!product) {
    return (
      <main className="bg-[#fafafa]">
        <section className="w-full py-12">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Product not found</h2>
            <p className="text-gray-500">Sorry, the product you are looking for does not exist.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <SearchBarSection />
          <div className="flex flex-col md:flex-row gap-8 items-start bg-white rounded-2xl shadow p-6">
            <img
              src={product.img}
              alt={product.name}
              className="w-full md:w-1/2 h-80 object-cover rounded-2xl shadow"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 text-blue-700">{product.brand}</h1>
              <h2 className="text-2xl font-semibold mb-4 text-black">{product.name}</h2>
              <p className="text-gray-600 mb-6">{product.description}</p>
              <span className="block font-bold text-xl text-black mb-6">Rp {product.price}</span>
              <button className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-red-600 transition">
                Buy Now!
              </button>
            </div>
          </div>
          <RecommendedSection products={products} />
        </div>
    </main>
  );
}