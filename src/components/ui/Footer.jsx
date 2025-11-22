'use client';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#3C3C3C] text-white pt-10 md:pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-8">
          <div className="text-center md:text-left">
            <div className="text-white text-xl md:text-2xl font-bold tracking-widest">JUALIN</div>
            <p className="mt-4 leading-relaxed text-sm md:text-base">
              Marketplace untuk semua kebutuhan Anda. Kami menghubungkan penjual dan
              pembeli, menghadirkan produk lokal hingga internasional dengan pengalaman
              belanja yang aman dan nyaman.
            </p>

            <div className="mt-6">
              <div className="text-white font-semibold text-center md:text-left">Temukan Kami</div>
              <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4">

                <a aria-label="Facebook" href="#" className="hover:opacity-80">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.4V12h2.4V9.7c0-2.4 1.4-3.8 3.6-3.8 1 0 2 .2 2 .2v2.2h-1.1c-1.1 0-1.5.7-1.5 1.4V12h2.6l-.4 2.9h-2.2v7A10 10 0 0 0 22 12Z"/>
                  </svg>
                </a>

                <a aria-label="Instagram" href="#" className="hover:opacity-80">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.5-2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                  </svg>
                </a>

                <a aria-label="X" href="#" className="hover:opacity-80">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h4.7l4.2 6.1L16.9 3H21l-7.4 9.9L21 21h-4.8l-4.6-6.7L7.1 21H3l7.7-10.2L3 3Z"/>
                  </svg>
                </a>

                <a aria-label="YouTube" href="#" className="hover:opacity-80">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c2.1.6 9.4.6 9.4.6s7.3 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.7 15.6V8.4l6.2 3.6-6.2 3.6Z"/>
                  </svg>
                </a>

                <a aria-label="LinkedIn" href="#" className="hover:opacity-80">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 8.98h3.96V21H3V8.98Zm7.49 0h3.79v1.63h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.65 4.78 6.1V21h-3.96v-4.93c0-1.18-.02-2.7-1.65-2.7-1.66 0-1.92 1.29-1.92 2.61V21h-3.96V8.98Z"/>
                  </svg>
                </a>

              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="text-white/80">© {new Date().getFullYear()} Jualin</div>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <a href="/kebijakan-privasi" className="hover:opacity-80">Kebijakan Privasi</a>
            <a href="/syarat-ketentuan" className="hover:opacity-80">Syarat & Ketentuan</a>
            <a href="/kontak" className="hover:opacity-80">Kontak</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;