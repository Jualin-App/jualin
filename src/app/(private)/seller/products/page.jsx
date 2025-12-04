"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSellerProducts } from "@/modules/seller/service.js";

export default function SellerProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user") || "null")
        : null;

    const sellerId = storedUser?.id || 1;

    const load = async () => {
      try {
        const list = await fetchSellerProducts(sellerId, 100);
        setProducts(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to load seller products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const formatRupiah = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price || 0);

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Produk Saya</h1>
          <button
            onClick={() => router.push("/seller/products/new")}
            className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-600"
          >
            Tambah Produk
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-10">
            Memuat produk...
          </div>
        ) : products.length === 0 ? (
          <div className="border-2 border-dashed rounded-2xl p-8 text-center text-gray-500">
            <p className="font-medium mb-2">Belum ada produk</p>
            <p className="text-sm mb-4">
              Tambahkan produk pertama Anda untuk mulai berjualan.
            </p>
            <button
              onClick={() => router.push("/seller/products/new")}
              className="px-4 py-2 bg-brand-red text-white rounded-full text-sm hover:bg-red-600"
            >
              Tambah Produk
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="flex justify-center mb-3">
                  <img
                    src={p.img || p.image || "/ProfilePhoto.png"}
                    alt={p.name}
                    className="h-20 object-contain"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm text-center">
                  {p.name}
                </h3>
                <p className="text-xs text-gray-600 text-center mb-3">
                  {p.size || p.brand || p.category || "Tidak ada informasi ukuran / brand"}
                </p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => router.push(`/seller/products/${p.id}/edit`)}
                    className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => router.push(`/product/${p.id}`)}
                    className="px-3 py-1 bg-brand-red text-white rounded-full text-sm hover:bg-red-600"
                  >
                    {formatRupiah(p.price)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

