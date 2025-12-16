"use client";
import React from "react";
import { useSearchParamSync } from "@/hooks/common/useSearchParamSync";

function SearchBar({ inline = false, className = "" }) {
  const { value, setValue, isFocused, setIsFocused } = useSearchParamSync();

  const inputEl = (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder="Cari produk, merek, atau deskripsi"
      className={`w-full px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-2xl shadow-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 hover:shadow-md hover:border-gray-400 hover:bg-gray-50 ${className}`}
      aria-label="Search products"
    />
  );

  if (inline) {
    return (
      <div className="w-full pl-4 sm:pl-8">
        <div className="max-w-7xl mx-auto">{inputEl}</div>
      </div>
    );
  }

  return (
    <section className="mt-4 sm:mt-6 mb-8 w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3">
        <div className="w-full px-12 flex justify-center">{inputEl}</div>
      </div>
    </section>
  );
}

export default SearchBar;
