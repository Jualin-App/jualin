import { NextResponse } from 'next/server';

// Daftar route yang valid
const validRoutes = [
  '/',
  '/dashboard',
  '/product',
  '/profile',
  '/profile/edit',
  '/auth/login',
  '/auth/register',
  '/chat',
  '/404_not_found',
  '/jual', // tambahkan route jual jika ada
];

// Route yang diizinkan dengan query parameters
const allowedRoutesWithParams = [
  '/profile/edit',
  '/product',
];

// Fungsi untuk check apakah path valid
function isValidRoute(pathname) {
  // Hapus query parameters untuk pengecekan
  const pathWithoutQuery = pathname.split('?')[0];
  
  // Check exact match
  if (validRoutes.includes(pathWithoutQuery)) {
    return true;
  }

  // Check jika path dimulai dengan route yang diizinkan dengan params
  for (const route of allowedRoutesWithParams) {
    if (pathWithoutQuery.startsWith(route)) {
      return true;
    }
  }

  // Check untuk kategori routes (jika route kategori belum dibuat, ini akan redirect ke 404)
  // Uncomment baris di bawah jika route kategori sudah dibuat
  // if (pathWithoutQuery.startsWith('/kategori/')) {
  //   return true;
  // }

  return false;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip untuk static files dan API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    /\.(ico|png|jpg|jpeg|gif|svg|css|js|json|woff|woff2|ttf|eot)$/.test(pathname) // file extensions
  ) {
    return NextResponse.next();
  }

  // Jika route tidak valid, redirect ke 404
  if (!isValidRoute(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/404_not_found';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

