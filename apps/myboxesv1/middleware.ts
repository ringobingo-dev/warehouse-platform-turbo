import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('user');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isPublicRoute = request.nextUrl.pathname === '/';

  // Allow public routes and API routes
  if (isPublicRoute || isApiRoute) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && userCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect private routes
  if (!isAuthPage && !userCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 