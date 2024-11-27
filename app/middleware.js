import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    if (req.nextUrl.pathname.startsWith("/admin")) {
      
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    
    
    return NextResponse.next();
  },

  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/cart/:path*",
    "/admin/:path*",
  ],
};
