// middleware.js
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// This lets Clerk know which routes should have auth enabled
export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // all routes except static files and _next
    "/",                          // root route
    "/api/(.*)",                  // your API endpoints
  ],
};
