import { NextResponse } from 'next/server'

const validRoutes = [
  '/',
  '/dashboard',
  '/product',
  '/profile',
  '/profile/edit',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/chat',
  '/404_not_found',
]

// Routes that can have sub-paths or parameters
const allowedRoutesWithParams = ['/profile/edit', '/product', '/seller']

function isValidRoute(pathname) {
  const pathWithoutQuery = pathname.split('?')[0]

  if (validRoutes.includes(pathWithoutQuery)) {
    return true
  }

  for (const route of allowedRoutesWithParams) {
    if (pathWithoutQuery.startsWith(route)) {
      return true
    }
  }

  return false
}

export function middleware(request) {
  const { pathname } = request.nextUrl
  const role = (request.cookies.get('role')?.value || '').toLowerCase()

  // 1. Skip static files and API routes (redundant with matcher but good for safety)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    /\.(ico|png|jpg|jpeg|gif|svg|css|js|json|woff|woff2|ttf|eot)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // 2. Role-Based Access Control (RBAC)
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

  // 3. Route Validation
  if (!isValidRoute(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/404_not_found'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
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
}
