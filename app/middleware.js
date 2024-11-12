// import { NextResponse } from "next/server";
// import * as jwt from "jsonwebtoken";
// export function middleware(request) {
//   const token = request.headers.get("authorization")?.split(" ")[1];
// // Rutas que requieren autenticación
//   const authRoutes = ["/api/cart"];
//   const isAuthRoute = authRoutes.some((route) =>
//     request.nextUrl.pathname.startsWith(route)
//   );

//   if (isAuthRoute) {
//     if (!token) {
//       return NextResponse.json({ error: "No autorizado" }, { status: 401 });
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const requestHeaders = new Headers(request.headers);
//       requestHeaders.set("userId", decoded.userId);

//       return NextResponse.next({
//         request: {
//           headers: requestHeaders,
//         },
//       });
//     } catch (error) {
//       return NextResponse.json({ error: "Token inválido" }, { status: 401 });
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: "/api/:path*",
// };

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
    // Añade aquí otras rutas que requieran autenticación
  ],
};
