'use client';
import React, { useEffect, useState } from "react";

function BannerSection({ banners }) {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);

  const handlePrev = () => {
    if (animating) return;
    setAnimating(true);
    setActive((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    setTimeout(() => setAnimating(false), 500);
  };

  const handleNext = () => {
    if (animating) return;
    setAnimating(true);
    setActive((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    setTimeout(() => setAnimating(false), 500);
  };

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(id);
  }, [paused, animating, banners.length]);

  return (
    <section className="w-full my-6 px-0">
      <div
        className="w-full overflow-hidden relative h-[340px] sm:h-[520px] flex items-center justify-start bg-gray-100"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="absolute inset-0 h-full w-full flex"
          style={{
            transform: `translateX(-${active * 100}%)`,
            transition: "transform 500ms ease-in-out",
          }}
        >
          {banners.map((banner, idx) => (
            <img
              key={idx}
              src={banner.src}
              alt={banner.alt}
              className="min-w-full h-full object-cover"
            />
          ))}
        </div>
        <div className="relative z-20 text-white px-4 sm:px-10 py-8 max-w-xl text-left">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 leading-tight">
            Jualin <br /> Jual Apapun Dengan <span className="text-white">♥</span> Love.
          </h2>
          <p className="mb-6 text-base sm:text-lg">
            Style that feels like home-warm, effortless, and made for every moment. Dress your family in comfort without compromising on cool.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button className="bg-red-500 text-white px-5 py-2 rounded-full font-semibold shadow">Snap {`{ Together }`}</button>
            <button className="bg-white text-gray-900 px-5 py-2 rounded-full font-semibold shadow">Explore Exclusive Collection</button>
          </div>
        </div>
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
