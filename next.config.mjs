/** @type {import('next').NextConfig} */
const nextConfig = {
  // JANGAN gunakan output: 'standalone' di Vercel
  // JANGAN gunakan outputFileTracing: false (karena bug sudah fix di versi baru)

  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        // Pastikan ini mengarah ke URL backend production Anda
        destination: 'https://api.jualin-tel.biz.id/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;