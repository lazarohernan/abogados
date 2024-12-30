import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/settings',
    '/profile',
  ];

  // Public routes that should redirect to dashboard if user is authenticated
  const publicAuthRoutes = [
    '/login',
    '/register',
    '/forgot-password',
  ];

  const path = req.nextUrl.pathname;

  // Check if the route is protected
  if (protectedRoutes.some(route => path.startsWith(route))) {
    if (!session) {
      // Redirect to login if accessing protected route without session
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Check if accessing auth routes while authenticated
  if (publicAuthRoutes.includes(path) && session) {
    // Redirect to dashboard if already authenticated
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Handle subscription status checks for premium features
  if (path.startsWith('/dashboard')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, trial_end')
      .eq('id', session?.user?.id)
      .single();

    if (profile) {
      // Check if trial has expired
      const trialEnd = profile.trial_end ? new Date(profile.trial_end) : null;
      const isTrialExpired = trialEnd ? trialEnd < new Date() : true;

      if (profile.subscription_status === 'inactive' && isTrialExpired) {
        // Redirect to subscription page if trial expired and no active subscription
        return NextResponse.redirect(new URL('/subscription', req.url));
      }
    }
  }

  return res;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (they handle their own auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};