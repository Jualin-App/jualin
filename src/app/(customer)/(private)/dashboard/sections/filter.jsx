"use client";
import React from "react";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Electronics", value: "electronics" },
  { label: "Hoodie", value: "hoodie" },
  { label: "T-shirt", value: "tshirt" },
  { label: "Beauty Product", value: "beauty" },
  { label: "Watches", value: "watches" },
];

export default function ProductFilter({ activeFilter, setActiveFilter }) {
  return (
    <div className="flex gap-3 justify-center mb-6 flex-wrap">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          className={`rounded-full px-4 py-1 font-semibold border transition
            ${
              activeFilter === filter.value
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }
          `}
          onClick={() => setActiveFilter(filter.value)}
          type="button"
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
