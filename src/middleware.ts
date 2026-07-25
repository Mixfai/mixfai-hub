import { clerkMiddleware } from '@clerk/astro/server';

/**
 * SyntaxHQ — Security Gate
 *
 * The Armory is PUBLIC: anyone can browse prompts, open a prompt detail, copy,
 * execute, and use the variable filler — no account required.
 *
 * AUTHENTICATION is required to build a portfolio (collect/star), rate, or
 * submit. EMPLOYEE-ONLY areas (review, studio, judging) stay gated separately
 * via isEmployee checks in those pages/endpoints.
 *
 * Unauthenticated users hitting an auth-required page are bounced to the
 * branded on-site /sign-in, preserving where they were headed.
 */
const PUBLIC_PATHS = [
  '/sign-in',
  '/sign-up',
  '/', // Armory
  '/prompts', // prompt detail pages
  '/editors-choice', // public read-only showcase
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => (p === '/' ? pathname === '/' : pathname === p || pathname.startsWith(p + '/')));
}

export const onRequest = clerkMiddleware((auth, context, next) => {
  const { isAuthenticated } = auth();
  const { pathname } = new URL(context.request.url);

  if (!isAuthenticated && !isPublic(pathname)) {
    // Bounce to the branded on-site sign-in, preserving where they were headed.
    const signInUrl = new URL('/sign-in', context.request.url);
    if (pathname !== '/') signInUrl.searchParams.set('redirect_url', pathname);
    return context.redirect(signInUrl.toString());
  }

  return next();
});
