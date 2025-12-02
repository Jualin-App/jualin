"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function SellerProductsPage() {
  const router = useRouter();
  const items = [
    { id: 201, name: "Climacool 2020", size: "UK 6-11", price: 1700000, img: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?q=80&w=600&auto=format&fit=crop" },
    { id: 202, name: "Yeezy 700 V3", size: "UK 6-11", price: 1700000, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop" },
    { id: 203, name: "Air Max 97", size: "UK 7-10", price: 2200000, img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop" },
  ];

  const formatRupiah = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Produk Saya</h1>
          <button onClick={() => router.push('/seller/products/new')} className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-600">Tambah Produk</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-shadow">
              <div className="flex justify-center mb-3">
                <img src={p.img} alt={p.name} className="h-20 object-contain" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm text-center">{p.name}</h3>
              <p className="text-xs text-gray-600 text-center mb-3">{p.size}</p>
              <div className="flex justify-center gap-2">
                <button onClick={() => router.push(`/seller/products/${p.id}/edit`)} className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-50">Edit</button>
                <button onClick={() => router.push(`/product/${p.id}`)} className="px-3 py-1 bg-brand-red text-white rounded-full text-sm hover:bg-red-600">{formatRupiah(p.price)}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

