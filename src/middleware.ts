// import { type NextRequest, NextResponse } from 'next/server';
// import { HOME_ROUTE, ROOT_ROUTE, SESSION_COOKIE_NAME } from '@/constant';

// const protectedRoutes = [HOME_ROUTE, "/account"];

// export default function middleware(request: NextRequest) {
//   const session = request.cookies.get(SESSION_COOKIE_NAME)?.value || '';

//   // Redirect to login if session is not set
//   if (!session && protectedRoutes.includes(request.nextUrl.pathname)) {
//     const absoluteURL = new URL(ROOT_ROUTE, request.nextUrl.origin);
//     return NextResponse.redirect(absoluteURL.toString());
//   }

//   // Redirect to home if session is set and user tries to access root
//   if (session && request.nextUrl.pathname === ROOT_ROUTE) {
//     const absoluteURL = new URL(HOME_ROUTE, request.nextUrl.origin);
//     return NextResponse.redirect(absoluteURL.toString());
//   }
// }
import { type NextRequest, NextResponse } from "next/server";
import { HOME_ROUTE, ROOT_ROUTE, SESSION_COOKIE_NAME } from "@/constant";

export default function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value || "";

  console.log("Middleware run: ", session, "session end");

  const currentPath = request.nextUrl.pathname;

  // Avoid redirect loop: Allow access to ROOT_ROUTE (/login) even without a session
  if (!session && currentPath === ROOT_ROUTE) {
    return NextResponse.next();
  }

  // Redirect to root (login) if there's no session and it's not ROOT_ROUTE
  if (!session) {
    const rootURL = new URL(ROOT_ROUTE, request.nextUrl.origin);
    console.log("Middleware, no session found. Redirecting to ROOT_ROUTE.");
    return NextResponse.redirect(rootURL.toString());
  }

  // Redirect to home if a session exists and user is on the root route
  if (session && currentPath === ROOT_ROUTE) {
    const homeURL = new URL(HOME_ROUTE, request.nextUrl.origin);
    console.log("Middleware, session found. Redirecting to HOME_ROUTE.");
    return NextResponse.redirect(homeURL.toString());
  }

  return NextResponse.next(); // Allow the request to proceed if no redirect needed
}
