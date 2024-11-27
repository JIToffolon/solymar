import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request, context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { orderId } = await context.params;

    if (!orderId) {
      return NextResponse.json(
        { error: "ID de orden no proporcionado" }, 
        { status: 400 }
      );
    }

    // Obtener la URL actual
    const url = new URL(request.url);
    // Verificar si es una consulta de polling
    const isPolling = url.searchParams.get('polling') === 'true';

    // Si es polling, solo devolver la información mínima necesaria
    if (isPolling) {
      const orderStatus = await prisma.orders.findUnique({
        where: {
          id: orderId,
          userId: session.user.id
        },
        select: {
          id: true,
          status: true,
          paymentId: true
        }
      });

      if (!orderStatus) {
        return NextResponse.json(
          { error: "Orden no encontrada" }, 
          { status: 404 }
        );
      }

      return NextResponse.json(orderStatus);
    }

    // Si no es polling, devolver la orden completa como antes
    const order = await prisma.orders.findUnique({
      where: {
        id: orderId,
        userId: session.user.id
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        paymentDetails: true 
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada" }, 
        { status: 404 }
      );
    }

    console.log("Estado actual de la orden:", {
      orderId: order.id,
      status: order.status,
      paymentId: order.paymentId
    });

    return NextResponse.json(order);

  } catch (error) {
    console.error("Error al obtener la orden:", error);
    return NextResponse.json(
      { 
        error: "Error al obtener la orden",
        details: error.message 
      },
      { status: 500 }
    );
  }
}