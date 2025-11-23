"use client";
import React from "react";

function SearchBar() {
  return (
    <section className="mb-8 w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3">
        <div className="w-full px-12 flex justify-center">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl shadow-sm
              text-gray-800 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
              transition-all duration-200"
          />
        </div>
      </div>
    </section>
  );
}

export default SearchBar;
