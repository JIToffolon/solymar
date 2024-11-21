// app/api/products/featured/route.js
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

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