'use client';
import React, { useState, useEffect } from "react";

function CategorySection({ categories }) {
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    function updateCount() {
      if (window.innerWidth < 640) setVisibleCount(6);
      else if (window.innerWidth < 1024) setVisibleCount(6);
      else setVisibleCount(8);
    }
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  const allCategories = [
    ...categories.slice(0, visibleCount - 1),
    {
      name: "More",
      icon: null,
      isMore: true,
    },
  ];

  const buttonClass =
    "flex flex-col items-center min-w-[80px] sm:min-w-[100px] md:min-w-[110px] lg:min-w-[120px] cursor-pointer bg-transparent border-none outline-none p-0 text-center transition hover:opacity-80";

  return (
    <section className="mb-8 w-full">
      <div className="max-w-6xl mx-auto">
        <div
          className={`flex gap-6 justify-start flex-nowrap w-full
            ${visibleCount < 8 ? "overflow-x-auto scrollbar-hide" : ""}
          `}
          style={{
            WebkitOverflowScrolling: "touch",
            paddingLeft: visibleCount < 8 ? "0.5rem" : "0",
            paddingRight: visibleCount < 8 ? "0.5rem" : "0",
          }}
        >
          {allCategories.map(cat => (
            <button
              key={cat.name}
              type="button"
              className={buttonClass}
              tabIndex={0}
              onClick={cat.isMore ? () => {} : undefined}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 shadow">
                {cat.isMore ? (
                  <span className="text-2xl text-gray-400">&#62;</span>
                ) : (
                  <img src={cat.icon} alt={cat.name} className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain" />
                )}
              </div>
              <div className={`text-xs sm:text-sm md:text-base font-medium ${cat.isMore ? "text-gray-400" : "text-gray-800"}`}>
                {cat.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;