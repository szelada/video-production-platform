import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // Refresh session if expired - required for Server Components
  // Use getUser() for better security and to ensure the session is valid
  const { data: { user } } = await supabase.auth.getUser();

  // Define protected routes
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/projects') ||
    request.nextUrl.pathname.startsWith('/calendar') ||
    request.nextUrl.pathname.startsWith('/casting') ||
    request.nextUrl.pathname.startsWith('/metrics') ||
    request.nextUrl.pathname.startsWith('/workspace') ||
    request.nextUrl.pathname === '/';

  /* 
  // TEMPORARILY DISABLED FOR DEBUGGING LOGIN HANG
  // If no user and trying to access a protected route, redirect to login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    
    // CRITICAL: We MUST create a new redirect response but carry over the cookies
    // from the Supabase client's response object (which contains the session sync logic)
    const redirectResponse = NextResponse.redirect(url);
    
    // Copy cookies from Supabase response to the redirect response
    response.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value, {
        domain: cookie.domain,
        maxAge: cookie.maxAge,
        path: cookie.path,
        sameSite: cookie.sameSite,
        secure: cookie.secure,
      });
    });
    
    return redirectResponse;
  }
  */

  // If there's a user and on login page, redirect to projects
  if (user && request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/projects';
    
    const redirectResponse = NextResponse.redirect(url);
    
    // Copy cookies from Supabase response to the redirect response
    response.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value, {
        domain: cookie.domain,
        maxAge: cookie.maxAge,
        path: cookie.path,
        sameSite: cookie.sameSite,
        secure: cookie.secure,
      });
    });
    
    return redirectResponse;
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
