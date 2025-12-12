"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchProductById, updateProduct } from "@/modules/product/service.js";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const product = await fetchProductById(productId);
        if (product) {
          setFormData({
            name: product.name || "",
            price: product.price || "",
            description: product.description || "",
            image: product.image || product.img || "",
          });
          setImagePreview(product.image || product.img || "");
        } else {
          setError("Produk tidak ditemukan");
        }
      } catch (err) {
        console.error("Failed to load product:", err);
        setError("Gagal memuat data produk");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (JPG atau PNG)");
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    // For now, we'll store the file object
    // In production, you'd want to upload it to a storage service first
    // and then store the URL in formData.image
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
    }));
    setError("");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Nama produk wajib diisi");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Harga produk wajib diisi dan harus lebih dari 0");
      return;
    }
    if (!formData.description.trim()) {
      setError("Deskripsi produk wajib diisi");
      return;
    }

    try {
      setSaving(true);
      
      // Get user from localStorage
      const storedUser =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("user") || "null")
          : null;

      const sellerId = storedUser?.id || 1;

      // Prepare payload
      const payload = {
        seller_id: sellerId,
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        image: formData.image || imagePreview, // Use existing image or preview URL
      };

      const updatedProduct = await updateProduct(productId, payload);
      
      if (updatedProduct) {
        router.push("/seller/products");
      } else {
        setError("Gagal menyimpan perubahan");
      }
    } catch (err) {
      console.error("Failed to update product:", err);
      setError("Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Skeleton Header */}
          <div className="h-8 bg-gray-200 rounded-lg w-48 mb-8 animate-pulse"></div>

          {/* Skeleton Photo Upload Section */}
          <div className="mb-8 p-8 border-2 border-gray-200 rounded-2xl bg-white shadow-lg">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse"></div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="h-10 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Skeleton Product Details Form */}
          <div className="mb-8 p-8 border-2 border-gray-200 rounded-2xl bg-white shadow-lg">
            {/* Skeleton Title */}
            <div className="h-7 bg-gray-200 rounded-lg w-40 mb-6 animate-pulse"></div>

            <div className="space-y-6">
              {/* Skeleton Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skeleton Nama Produk */}
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>

                {/* Skeleton Harga Produk */}
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>

              {/* Skeleton Deskripsi Produk */}
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-36 animate-pulse"></div>
                <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>

              {/* Skeleton Save Button */}
              <div className="pt-4">
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Produk</h1>

        {/* Photo Upload Section */}
        <div className="mb-8 p-8 border-2 border-gray-200 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-200">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <button
                type="button"
                onClick={handleUploadClick}
                className="px-6 py-2 bg-brand-red text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium shadow-sm mb-2"
              >
                Upload new photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
                onChange={handleImageSelect}
              />
              <p className="text-sm text-gray-600">
                At least 800x800 px recommended.
              </p>
              <p className="text-sm text-gray-600">
                JPG or PNG is allowed.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Product Details Form */}
        <div className="mb-8 p-8 border-2 border-gray-200 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Detail Produk
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Produk */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your product"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent hover:border-brand-red hover:shadow-md outline-none shadow-sm transition-all duration-300 ease-in-out"
                  required
                />
              </div>

              {/* Harga Produk */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Harga Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter your price product"
                  min="0"
                  step="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent hover:border-brand-red hover:shadow-md outline-none shadow-sm transition-all duration-300 ease-in-out"
                  required
                />
              </div>
            </div>

            {/* Deskripsi Produk */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Deskripsi Produk <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter your description product"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent hover:border-brand-red hover:shadow-md outline-none shadow-sm transition-all duration-300 ease-in-out resize-none"
                required
              />
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-brand-red text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

