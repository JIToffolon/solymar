import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        include: {
          user: {
            select: {
              email: true,
              name: true,
            },
          },
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit
      }),
      prisma.orders.count()
    ]);

    return NextResponse.json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Error al obtener las órdenes" },
      { status: 500 }
    );
  }
}