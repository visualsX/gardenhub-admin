import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req) {
  const { pathname } = req.nextUrl;

  // Public routes that don't require authentication
  const publicPaths = ['/auth/login', '/auth/signup', '/auth/forgot-password'];

  // Check if current path is public (supports any locale)
  const isPublicRoute = publicPaths.some((path) => {
    // Match exact path or with locale prefix (e.g., /en/login, /ar/login)
    return pathname === path || pathname.match(new RegExp(`^/[a-z]{2}${path}$`));
  });

  // If it's a public route, allow access
  if (isPublicRoute) {
    return intlMiddleware(req);
  }

  // Check for authentication token
  const token = req.cookies.get('token');

  // If no token and trying to access protected route, redirect to login
  if (!token) {
    const locale = pathname.split('/')[1] || 'en'; // Extract locale from path
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));
  }

  // User is authenticated, continue with intl middleware
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
