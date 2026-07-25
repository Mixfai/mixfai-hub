import { clerkMiddleware } from '@clerk/astro/server';

/**
 * SyntaxHQ — Security Gate
 *
 * The ENTIRE site is private. Any request that is not authenticated by Clerk
 * is redirected to the Clerk-hosted sign-in page. There are no public routes.
 */
export const onRequest = clerkMiddleware((auth, context, next) => {
  const { isAuthenticated, redirectToSignIn } = auth();

  if (!isAuthenticated) {
    // Bounce unauthenticated users to the Clerk login page.
    return redirectToSignIn();
  }

  // Authenticated → allow the request to continue.
  return next();
});
