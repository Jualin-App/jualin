import { NextResponse } from 'next/server';

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
];

const allowedRoutesWithParams = [
  '/profile/edit',
  '/product',
];

function isValidRoute(pathname) {
  const pathWithoutQuery = pathname.split('?')[0];

  if (validRoutes.includes(pathWithoutQuery)) {
    return true;
  }

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

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    /\.(ico|png|jpg|jpeg|gif|svg|css|js|json|woff|woff2|ttf|eot)$/.test(pathname) 
  ) {
    return NextResponse.next();
  }

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

