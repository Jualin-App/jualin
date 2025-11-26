/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8000/api/v1/:path*',
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