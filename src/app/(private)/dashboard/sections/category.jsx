'use client';
import React, { useRef } from "react";
import useHorizontalScroll from "../hooks/useHorizontalScroll.jsx";

function CategorySection({ categories }) {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = React.useState(false);
  const { handleScrollRight, handleScrollLeft } = useHorizontalScroll(scrollRef, setShowLeft);

  return (
    <section className="mb-8 w-full">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <h2 className="font-bold text-2xl mb-6 text-gray-800 text-left">Explore Jualin</h2>
        <div className="relative flex items-center">
          {showLeft && (
            <button
              type="button"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl text-gray-700 cursor-pointer border-none outline-none transition hover:bg-gray-300 z-10"
              tabIndex={0}
              onClick={handleScrollLeft}
              aria-label="Scroll left"
            >
              &#60;
            </button>
          )}
          <div
            ref={scrollRef}
            className="flex gap-6 md:gap-10 w-full overflow-x-hidden scrollbar-hide px-12"
            style={{ scrollBehavior: "smooth" }}
          >
            {categories.map(cat => (
              <button
                key={cat.name}
                type="button"
                className="flex flex-col items-center min-w-[120px] md:min-w-[140px] cursor-pointer bg-transparent border-none outline-none p-0 text-center transition hover:opacity-80"
                tabIndex={0}
              >
                <div className="text-4xl mb-2">{cat.icon}</div>
                <div className="text-base text-gray-800 font-medium">{cat.name}</div>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl text-gray-700 cursor-pointer border-none outline-none transition hover:bg-gray-300 z-10"
            tabIndex={0}
            onClick={handleScrollRight}
            aria-label="Scroll right"
          >
            &#62;
          </button>
        </div>
      </div>
    </section>
  );
}

export default CategorySection;