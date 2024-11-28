import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Necesitamos esperar por los params
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { error: "ID de orden no proporcionado" },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const isPolling = url.searchParams.get("polling") === "true";

    if (isPolling) {
      const orderStatus = await prisma.orders.findUnique({
        where: {
          id: orderId,
          userId: session.user.id,
        },
        select: {
          id: true,
          status: true,
          paymentId: true,
        },
      });

      if (!orderStatus) {
        return NextResponse.json(
          { error: "Orden no encontrada" },
          { status: 404 }
        );
      }

      if (orderStatus.status === "pending" && orderStatus.paymentId) {
        try {
          const mpResponse = await fetch(
            `https://api.mercadopago.com/v1/payments/${orderStatus.paymentId}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
              },
            }
          );

          if (mpResponse.ok) {
            const paymentInfo = await mpResponse.json();
            console.log("Estado en MP:", paymentInfo.status);

            if (paymentInfo.status !== orderStatus.status) {
              await prisma.orders.update({
                where: { id: orderId },
                data: { status: paymentInfo.status },
              });
              orderStatus.status = paymentInfo.status;
            }
          }
        } catch (error) {
          console.error("Error verificando estado en MP:", error);
        }
      }

      return NextResponse.json(orderStatus);
    }

    const order = await prisma.orders.findUnique({
      where: {
        id: orderId,
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        paymentDetails: true,
      },
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
      paymentId: order.paymentId,
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    return NextResponse.json(
      {
        error: "Error al obtener la orden",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
