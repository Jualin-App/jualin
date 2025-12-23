import { NextResponse } from 'next/server'

export function middleware(request) {
  const pathname = request.nextUrl.pathname
  const role = (request.cookies.get('role')?.value || '').toLowerCase()

  // dashboard → seller dashboard
  if (pathname.startsWith('/dashboard') && role === 'seller') {
    const url = request.nextUrl.clone()
    url.pathname = '/seller/dashboard'
    return NextResponse.redirect(url)
  }

  // seller area → hanya seller
  if (pathname.startsWith('/seller') && role !== 'seller') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/seller/:path*'],
}
