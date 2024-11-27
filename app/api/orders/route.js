import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { MercadoPagoConfig, Payment } from "mercadopago";

const prisma = new PrismaClient();
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN 
});

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { formData, orderData } = await request.json();
    console.log("Creando orden:", { formData, orderData });

    // Crear la orden como PENDING
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.orders.create({
        data: {
          userId: session.user.id,
          status: "pending", // Siempre comienza como pending
          total: orderData.total,
          paymentMethod: formData.payment_method_id,
          items: {
            create: orderData.items.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.unit_price
            }))
          }
        },
        include: {
          items: true
        }
      });

      return newOrder;
    });

    console.log("Orden creada:", order);

    // Procesar el pago con MercadoPago
    const paymentApi = new Payment(client);
    const payment = await paymentApi.create({
      body: {
        transaction_amount: Number(orderData.total),
        payment_method_id: formData.payment_method_id,
        token: formData.token,
        installments: parseInt(formData.installments),
        payer: {
          email: session.user.email
        },
        metadata: {
          order_id: order.id
        }
      }
    });

    console.log("Respuesta de pago:", payment);

    // Actualizar SOLO el paymentId, mantener estado pending
    const updatedOrder = await prisma.orders.update({
      where: { id: order.id },
      data: {
        paymentId: payment.id.toString(),
        installments: payment.installments || 1
      }
    });

    console.log("Orden actualizada con paymentId:", updatedOrder);

    return NextResponse.json({
      status: payment.status,
      order_id: order.id,
      payment_id: payment.id
    });

  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      { error: "Error al procesar la orden", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const orders = await prisma.orders.findMany({
      where: {
        userId: session.user.id,
        status: {
          in: ['approved', 'pending']
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener las órdenes" },
      { status: 500 }
    );
  }
}