"use client";
import { useState, useEffect } from "react";

const TEXTS = [
  "Yuk hemat bareng! Jual atau beli barang bekas berkualitas dengan aman dan cepat.",
  "Dapatkan produk terbaru dengan harga terbaik setiap hari!",
  "Tetap waspada! Jangan lakukan pembayaran di luar platform untuk menghindari penipuan.",
  "Pastikan selalu cek identitas penjual & gunakan fitur chat resmi untuk transaksi aman.",
];

function TopBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSlidingOut, setIsSlidingOut] = useState(false);
  const [justChanged, setJustChanged] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Mulai slide out (ke atas) - cepat
      setIsSlidingOut(true);
      setJustChanged(false);
      
      // Setelah slide out selesai, ganti teks dan slide in dari bawah
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % TEXTS.length);
        setJustChanged(true);
        setIsSlidingOut(false);
      }, 300); // Durasi animasi cepat (300ms)
    }, 3000); // Jeda 3 detik per teks

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black text-white text-xs py-2 px-4 text-center overflow-hidden relative h-8">
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
          isSlidingOut
            ? "-translate-y-full opacity-0"
            : justChanged
            ? "animate-slide-in-from-bottom translate-y-0 opacity-100"
            : "translate-y-0 opacity-100"
        }`}
        key={currentIndex}
      >
        Most News: {TEXTS[currentIndex]}
      </div>
    </div>
  );
}

export default TopBar;
