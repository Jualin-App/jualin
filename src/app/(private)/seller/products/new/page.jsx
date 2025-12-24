"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { productService } from "@/services/product/productService";

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock_quantity: "",
    category: "",
    condition: "new",
    status: "active",
  });

  const [imageFile, setImageFile] = useState(null);

  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (JPG atau PNG)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran gambar terlalu besar. Maksimal 2MB. Silakan gunakan gambar dengan ukuran lebih kecil atau kompres terlebih dahulu.");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setImageFile(file);
    setError("");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
    if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) {
      setError("Stok produk wajib diisi dan tidak boleh negatif");
      return;
    }

    try {
      setSaving(true);

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        category: formData.category.trim() || '',
        condition: formData.condition,
        status: formData.status,
      };

      const result = await productService.create(productData, imageFile);

      if (result) {
        router.push("/seller/products");
      } else {
        setError("Gagal menambahkan produk");
      }
    } catch (err) {
      console.error("Failed to create product:", err);

      const validationErrors = err.originalError?.response?.data?.errors;
      if (validationErrors) {
        const firstError = Object.values(validationErrors).flat()[0];
        setError(firstError);
      } else {
        setError(err.message || "Gagal menambahkan produk");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Tambah Produk</h1>

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
                Upload product photo
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

              {/* Stock Quantity */}
              <div>
                <label
                  htmlFor="stock_quantity"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Stok Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="stock_quantity"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  placeholder="Enter stock quantity"
                  min="0"
                  step="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent hover:border-brand-red hover:shadow-md outline-none shadow-sm transition-all duration-300 ease-in-out"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Kategori
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g. Electronics, Fashion, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent hover:border-brand-red hover:shadow-md outline-none shadow-sm transition-all duration-300 ease-in-out"
                />
              </div>

              {/* Condition */}
              <div>
                <label
                  htmlFor="condition"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Kondisi
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent hover:border-brand-red hover:shadow-md outline-none shadow-sm transition-all duration-300 ease-in-out"
                >
                  <option value="new">Baru</option>
                  <option value="used">Bekas</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent hover:border-brand-red hover:shadow-md outline-none shadow-sm transition-all duration-300 ease-in-out"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
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
                {saving ? "Menambahkan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

