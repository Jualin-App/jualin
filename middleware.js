import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl;
  const role = (request.cookies.get('role')?.value || '').toLowerCase();

  if (url.pathname.startsWith('/dashboard')) {
    if (role === 'seller') {
      url.pathname = '/seller/dashboard';
      return NextResponse.redirect(url);
    }
  }

  if (url.pathname.startsWith('/seller')) {
    if (role !== 'seller') {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/seller/:path*']
};