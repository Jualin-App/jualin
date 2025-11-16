'use client';
import React from "react";
import useHorizontalScroll from "../hooks/useHorizontalScroll.jsx";

function BannerSection({ banners}) {
  //di backend lupa ada banner apa kaga
  const scrollRef = React.useRef(null);
  const [showLeft, setShowLeft] = React.useState(false);
  const { handleScrollRight, handleScrollLeft } = useHorizontalScroll(scrollRef, setShowLeft);
  
  return (
    <section className="w-full mb-8">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
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
            className="flex gap-4 md:gap-6 w-full overflow-x-hidden px-12"
            style={{ scrollBehavior: "smooth" }}
          >
            {banners.map((banner, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-[80vw] max-w-[320px] md:w-[calc(50%-12px)] md:max-w-[500px] flex justify-center"
              >
                <img
                  src={banner.src}
                  alt={banner.alt}
                  className="w-full h-[140px] md:h-[160px] rounded-2xl object-cover shadow-md"
                />
              </div>
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

export default BannerSection;