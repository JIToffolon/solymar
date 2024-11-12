// app/api/products/featured/route.js
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// export async function GET() {
//   try {
//     console.log("Iniciando búsqueda de productos destacados..."); // Debug log

//     const featuredProducts = await prisma.product.findMany({
//       where: {
//         featured: true,
//         active: true,
//       },
//       select: {
//         id: true,
//         name: true,
//         price: true,
//         imageUrl: true,
//         description: true,
//       },
//     });

//     console.log("Productos encontrados:", featuredProducts); // Debug log

//     // Si no hay productos, devolver array vacío pero no error
//     if (!featuredProducts || featuredProducts.length === 0) {
//       return NextResponse.json({
//         products: [],
//         message: "No featured products found",
//       });
//     }

//     return NextResponse.json({
//       products: featuredProducts,
//       message: "Products fetched successfully",
//     });
//   } catch (error) {
//     // Log detallado del error
//     console.error("Error completo:", error);

//     return NextResponse.json(
//       {
//         error: "Error al cargar los productos destacados",
//         details: error.message,
//         stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }
// app/api/products/featured/route.js

export async function GET() {
  try {
    const featuredProducts = await prisma.product.findMany({
      where: {
        featured: true,
        active: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        description: true,
      }
    });

    return NextResponse.json(featuredProducts); // Devolvemos el array directamente
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json([], { status: 500 }); // Devolvemos array vacío en caso de error
  }
}