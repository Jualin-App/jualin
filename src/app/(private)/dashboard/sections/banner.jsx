"use client";
import React, { useEffect, useState } from "react";

function BannerSection({ banners }) {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);

  const handlePrev = () => {
    if (animating) return;
    setAnimating(true);
    setActive((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    setTimeout(() => setAnimating(false), 300);
  };

  const handleNext = () => {
    if (animating) return;
    setAnimating(true);
    setActive((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    setTimeout(() => setAnimating(false), 300);
  };

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(id);
  }, [paused, animating, banners.length]);

  const onMouseMove = null;

  return (
    <section className="w-full mt-4 sm:mt-8 mb-6 px-2 sm:px-4">
      <div
        className="w-full max-w-7xl mx-auto overflow-hidden relative h-[400px] sm:h-[560px] flex items-center justify-start bg-gray-100 rounded-2xl"
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
            <div key={idx} className="min-w-full h-full relative">
              <img
                src={banner.src}
                alt={banner.alt}
                className={`absolute inset-0 w-full h-full object-cover rounded-2xl ${idx === active ? "animate-kenburns will-change-transform" : ""}`}
                style={idx === active ? undefined : { transform: "scale(0.995)" }}
              />
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 inset-x-0 h-12 sm:h-16 bg-gradient-to-b from-transparent via-white/30 to-white/90 z-10 pointer-events-none" />
        <div className="relative z-20 text-white px-4 sm:px-10 py-8 max-w-xl text-left">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 leading-tight">
            Jualin <br /> Jual Apapun Dengan <span className="text-white">♥</span>
          </h2>
          <p className="mb-6 text-base sm:text-lg">
            Temukan barang terbaik untuk setiap kebutuhanmu. Simpel, nyaman, dan selalu siap menemani setiap momen.
          </p>
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
