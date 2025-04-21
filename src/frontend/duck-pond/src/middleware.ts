import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTokenPayload } from './lib/jwt';

// List of protected routes that require authentication
const protectedRoutes = ['/home', '/profile', '/settings'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current route is protected
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Get the token from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      // If no token, redirect to sign-in
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    // Verify the token
    const payload = await getTokenPayload();
    if (payload == null) {
      // If token is invalid, redirect to sign-in
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - signin (sign-in page)
     * - signup (sign-up page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|signin|signup).*)',
  ],
};