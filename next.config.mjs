/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://api.jualin-tel.biz.id/api/v1/:path*',
      },
    ];
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/:path((?!dashboard).*)', 
  //       destination: '/dashboard',
  //       permanent: false,
  //     },
  //   ];
  // },
};

export default nextConfig;