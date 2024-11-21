import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import MercadoPago from "mercadopago";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { formData, orderData } = await request.json();

    // Configurar MercadoPago
    MercadoPago.configure({
      access_token: process.env.MP_ACCESS_TOKEN,
    });

    // Crear la orden en la base de datos
    const order = await prisma.$transaction(async (tx) => {
      // Crear la orden
      const newOrder = await tx.orders.create({
        data: {
          userId: session.user.id,
          status: "pending",
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

      // Vaciar el carrito del usuario
      const cart = await tx.cart.findUnique({
        where: { userId: session.user.id },
        include: { items: true }
      });

      if (cart) {
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id }
        });
      }

      return newOrder;
    });

    // Procesar el pago con MercadoPago
    const payment = await MercadoPago.payment.create({
      transaction_amount: orderData.total,
      payment_method_id: formData.payment_method_id,
      token: formData.token,
      installments: formData.installments,
      payer: {
        email: session.user.email
      }
    });

    // Actualizar el estado de la orden
    await prisma.orders.update({
      where: { id: order.id },
      data: {
        status: payment.status,
        paymentId: payment.id.toString()
      }
    });

    return NextResponse.json({
      status: payment.status,
      order_id: order.id
    });

  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      { error: "Error al procesar la orden" },
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