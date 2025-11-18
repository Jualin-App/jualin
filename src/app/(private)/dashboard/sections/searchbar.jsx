'use client';
import React from "react";

function SearchBarSection() {
  //fungsinya harus dibuat setelah backend siap
  return (
    <section className="py-4 px-2 sm:px-4 flex justify-center">
      <div className="w-full max-w-6xl mx-auto">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl shadow-sm
            text-gray-800 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
            transition-all duration-200"
        />
      </div>
    </section>
  );
}

export default SearchBarSection;