import { type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession();

  // Define protected routes
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/projects') ||
    request.nextUrl.pathname.startsWith('/calendar') ||
    request.nextUrl.pathname.startsWith('/casting') ||
    request.nextUrl.pathname.startsWith('/metrics') ||
    request.nextUrl.pathname.startsWith('/workspace') ||
    request.nextUrl.pathname === '/';

  // If no session and trying to access a protected route, redirect to login
  if (!session && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // If the user was trying to access a specific page, we can optionally redirect them back after login
    // url.searchParams.set('next', request.nextUrl.pathname);
    return Response.redirect(url);
  }

  // If there's a session and user is on login page, redirect to projects
  if (session && request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/projects';
    return Response.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
