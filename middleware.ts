import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const ADMIN_PATHS = ["/admin", "/admin/:path*"];  // example admin routes
export default withAuth(
  function middleware(req) {
    // This function could be empty if we rely on callbacks, but we include it for clarity
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // If no token, not logged in
        if (!token) return false;
        const { pathname } = req.nextUrl;
        // Allow if path doesn't require special role
        // e.g., everyone can access / (home), /schools, etc., so return true for those
        // Here, restrict admin paths:
        if (ADMIN_PATHS.some(path => pathname.startsWith(path))) {
          // If path is under /admin, require superadmin role
          return token.role === "SUPERADMIN";
        }
        // You can add other role-based rules for other paths as needed
        return true;
      }
    }
  }
);

export const config = { matcher: ["/dashboard/:path*"] };
