import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Just let the middleware handle basic auth checks
    // Don't do any redirects here
    return;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Only protect dashboard routes
        if (pathname.startsWith("/dashboard")) {
          return !!token;
        }

        // Allow everything else
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
