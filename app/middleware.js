import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/cart/:path*",
    "/admin/:path*",
    // Añade aquí otras rutas que requieran autenticación
  ],
};
