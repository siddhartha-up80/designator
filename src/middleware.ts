import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get the session token from cookies
  const sessionToken =
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token");

  const isLoggedIn = !!sessionToken;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/signin", "/signup"];
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = pathname.startsWith("/api/auth");

  // Allow API auth routes
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // Allow access to public routes
  if (isPublicRoute) {
    // If user is logged in and tries to access signin/signup, redirect to home
    if (isLoggedIn && (pathname === "/signin" || pathname === "/signup")) {
      return NextResponse.redirect(new URL("/home", req.url));
    }
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (!isLoggedIn) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/signin?callbackUrl=${callbackUrl}`, req.url)
    );
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
     * - images folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public|images|.*\\..*|api/auth).*)",
  ],
};
