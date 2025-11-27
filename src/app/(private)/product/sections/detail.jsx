"use client";
import React from "react";
import Toast from "../../../../components/ui/Toast";
import useMidtransPayment from "../hooks/useMidtransPayment";

export default function ProductDetailSection({ product }) {
  const { pay, loading, toast, setToast } = useMidtransPayment();

  if (!product)
    return (
      <div className="text-center py-12 text-gray-300">
        Stok produk kosong atau telah dihapus
      </div>
    );

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="flex flex-col md:flex-row gap-8 items-start bg-white rounded-2xl shadow p-6">
        <img
          src={
            product.img || "https://via.placeholder.com/400x400?text=No+Image"
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
          <div className="flex items-center gap-3">
            <button
              className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-red-600 transition"
              onClick={() => pay(product)}
              disabled={loading}
            >
              {loading ? "Processing..." : "Buy Now"}
            </button>
            <a
              href="/chat"
              className="px-6 py-2 rounded-full font-semibold border border-gray-300 text-gray-800 bg-white hover:bg-gray-100 transition shadow"
              aria-label="Open chat"
            >
              Chat
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
