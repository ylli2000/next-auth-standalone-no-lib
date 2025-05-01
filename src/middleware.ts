import { validateSession } from '@/lib/session/sessionManager';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Add routes that should be protected
const protectedRoutes = ['/me', '/api/auth/me'];

// Add routes that should be accessible only to non-authenticated users
const authRoutes = ['/auth', '/verify'];

/**
 * Middleware function that runs on every request matching the matcher pattern
 *
 * Sliding Session Integration:
 * - This is where the sliding session mechanism is triggered on every matching request
 * - By calling validateSession(), middleware ensures that any user activity extends the session
 * - The validateSession() function both verifies the session and refreshes its expiration time
 * - This creates a seamless sliding window effect where the session stays alive during active use
 * - No additional code is needed for sliding sessions; it happens automatically on each request
 */
export async function middleware(request: NextRequest) {
    // This call triggers the sliding session mechanism by extending the session duration
    // if the session is valid - it's the entry point to the sliding window behavior
    const userId = await validateSession();
    const { pathname } = request.nextUrl;

    // Check if the route is protected
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // Redirect authenticated users away from auth pages
    if (userId && isAuthRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Redirect non-authenticated users to login
    if (!userId && isProtectedRoute) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

/**
 * Matcher configuration for the middleware
 * This determines which requests will trigger the middleware
 *
 * Note for Sliding Sessions:
 * - The matcher should include all routes where you want session extension to occur
 * - Each matched route will trigger validateSession() and refresh the session expiration
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (public files)
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)'
    ]
};
