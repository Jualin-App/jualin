'use client';
import React from "react";

function RecommendedSection({ products }) {
  return (
    <section className="w-full">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <h2 className="font-bold text-2xl mb-6 text-gray-900 text-left">Recommended</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="bg-white rounded-xl p-0 shadow border border-gray-200 flex flex-col cursor-pointer transition hover:shadow-lg focus:outline-none text-left"
              tabIndex={0}
            >
              <div className="flex items-center gap-2 px-4 pt-4">
                <img src={`https://i.pravatar.cc/32?u=${p.user}`} alt={p.user}
                  className="w-7 h-7 rounded-full" />
                <div>
                  <div className="font-medium text-gray-900">{p.user}</div>
                  <div className="text-xs text-gray-500">{p.time}</div>
                </div>
              </div>
              <img src={p.img} alt={p.name}
                className="w-full h-[170px] object-cover rounded-lg mt-4" />
              <div className="px-4 pb-4 pt-2">
                <div className="font-semibold text-gray-900">{p.name}</div>
                <div className="text-gray-800">{p.price}</div>
                <div className="text-xs text-gray-600">{p.condition}</div>
                <div className="mt-2 text-lg text-gray-400">♡</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecommendedSection;