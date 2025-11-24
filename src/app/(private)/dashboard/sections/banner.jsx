'use client';
import React, { useState } from "react";

function BannerSection({ banners }) {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("right");

  const handlePrev = () => {
    if (animating) return;
    setDirection("left");
    setAnimating(true);
    setTimeout(() => {
      setActive((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
      setAnimating(false);
    }, 400);
  };

  const handleNext = () => {
    if (animating) return;
    setDirection("right");
    setAnimating(true);
    setTimeout(() => {
      setActive((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
      setAnimating(false);
    }, 400);
  };

  return (
    <section className="w-full my-6 px-0">
      <div className="w-full overflow-hidden relative h-[220px] sm:h-[340px] flex items-center justify-start bg-gray-100">
        {banners.map((banner, idx) => {
          let show = idx === active;
          let slideOut = animating && (
            (direction === "right" && idx === active) ||
            (direction === "left" && idx === active)
          );
          let slideIn =
            animating &&
            ((direction === "right" && idx === (active + 1) % banners.length) ||
              (direction === "left" && idx === (active - 1 + banners.length) % banners.length));

          return (
            <img
              key={idx}
              src={banner.src}
              alt={banner.alt}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500
                ${show && !animating ? "opacity-100 translate-x-0 z-10" : "opacity-0 z-0"}
                ${slideOut && direction === "right" ? "-translate-x-full opacity-0 z-0" : ""}
                ${slideOut && direction === "left" ? "translate-x-full opacity-0 z-0" : ""}
                ${slideIn && direction === "right" ? "translate-x-0 opacity-100 z-10" : ""}
                ${slideIn && direction === "left" ? "translate-x-0 opacity-100 z-10" : ""}
              `}
              style={{ pointerEvents: show ? "auto" : "none" }}
            />
          );
        })}
        <div className="relative z-20 text-white px-4 sm:px-10 py-8 max-w-xl text-left">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 leading-tight">
            Warm Love <br /> Family <span className="text-white">♥</span> Love.
          </h2>
          <p className="mb-6 text-base sm:text-lg">
            Style that feels like home-warm, effortless, and made for every moment. Dress your family in comfort without compromising on cool.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button className="bg-red-500 text-white px-5 py-2 rounded-full font-semibold shadow">Snap {`{ Together }`}</button>
            <button className="bg-white text-gray-900 px-5 py-2 rounded-full font-semibold shadow">Explore Exclusive Collection</button>
          </div>
        </div>
        {/* Arrow left */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 border-white text-white rounded-full w-10 h-10 flex items-center justify-center z-30"
          onClick={handlePrev}
          aria-label="Previous banner"
        >
          &#60;
        </button>
        {/* Arrow right */}
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 border-white text-white rounded-full w-10 h-10 flex items-center justify-center z-30"
          onClick={handleNext}
          aria-label="Next banner"
        >
          &#62;
        </button>
        {/* Carousel indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {banners.map((_, idx) => (
            <span
              key={idx}
              className={`w-3 h-3 rounded-full bg-white transition-opacity ${
                active === idx ? "opacity-80" : "opacity-40"
              }`}
              onClick={() => !animating && setActive(idx)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default BannerSection;