import { clerkMiddleware } from '@clerk/astro/server';

/**
 * SyntaxHQ — Security Gate
 *
 * The ENTIRE site is private except the branded auth pages. Unauthenticated
 * users are redirected to our on-site /sign-in (cyber-terminal themed), not
 * Clerk's hosted page.
 */
const PUBLIC_PATHS = ['/sign-in', '/sign-up'];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
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
