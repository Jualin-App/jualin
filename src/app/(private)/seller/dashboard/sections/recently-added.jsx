"use client";
import React from "react";
import { useRouter } from "next/navigation";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { MoreHorizontal, Plus } from "lucide-react";

const RecentlyAddedSection = ({ products }) => {
  const router = useRouter();

  const handleEdit = (productId) => {
    router.push(`/seller/products/${productId}/edit`);
  };

  const handleView = (productId) => {
    router.push(`/product/${productId}`);
  };

  const handleDelete = (productId) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      // Handle delete logic here
      console.log("Delete product:", productId);
    }
  };

  const formatRupiah = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const defaultProducts = [
    {
      id: 101,
      name: "Yeezy 700 V3",
      size: "UK 6-11",
      price: 1700000,
      img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 102,
      name: "Yeezy 700 V3",
      size: "UK 6-11",
      price: 1700000,
      img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 103,
      name: "Yeezy 700 V3",
      size: "UK 6-11",
      price: 1700000,
      img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop"
    },
  ];

  const list = Array.isArray(products) && products.length > 0 ? products : defaultProducts;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Produk Terbaru</h2>
          <p className="text-sm text-gray-600">Produk yang baru ditambahkan</p>
        </div>
        <button 
          onClick={() => router.push('/seller/products')}
          className="text-sm text-brand-red hover:text-red-600 font-medium"
        >
          Lihat Semua
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {list.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-shadow duration-200">
            <div className="relative">
              <button className="absolute top-0 right-0 h-6 w-6 text-gray-400 flex items-center justify-center">
                <DropdownMenu
                  trigger={<MoreHorizontal className="h-4 w-4" />}
                  items={[
                    { label: "Edit Produk", onClick: () => handleEdit(product.id) },
                    { label: "Lihat Produk", onClick: () => handleView(product.id) },
                    { label: "Hapus Produk", onClick: () => handleDelete(product.id), variant: "danger" }
                  ]}
                />
              </button>
              <div className="flex justify-center mb-3">
                <img src={product.img || "/ProfilePhoto.png"} alt={product.name} className="h-20 object-contain" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
              <p className="text-xs text-gray-600 mb-3">{product.size || product.brand || "UK 6-11"}</p>
              <button
                onClick={() => handleView(product.id)}
                className="bg-brand-red text-white rounded-full px-4 py-1 text-sm hover:bg-red-600"
              >
                {formatRupiah(product.price)}
              </button>
            </div>
          </div>
        ))}

        {/* Add New Product Card */}
        <div className="border-2 border-dashed rounded-2xl p-4 min-h-[180px] flex items-center justify-center">
          <button
            onClick={() => router.push('/seller/products/new')}
            className="h-12 w-12 rounded-full border-2 border-dashed border-gray-400 text-gray-500 hover:text-gray-700 hover:border-gray-700 flex items-center justify-center"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentlyAddedSection;
