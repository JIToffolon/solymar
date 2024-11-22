import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, context) {
    try {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }
  
      const { orderId } = await context.params;
  
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
          user: true
        }
      });
  
      if (!order) {
        return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
      }
  
      // Datos de ejemplo para la factura
      const invoiceData = {
        invoiceNumber: `${order.id.slice(-8)}`,
        date: new Date(order.createdAt).toLocaleDateString(),
        customer: {
          name: order.user.name || "Consumidor Final",
          email: order.user.email,
          cuit: "XX-XXXXXXXX-X",
          address: "Dirección del cliente"
        },
        items: order.items.map(item => ({
          id: item.product.id,
          description: item.product.name,
          quantity: item.quantity,
          price: Number(item.price),
          total: Number(item.price) * item.quantity
        })),
        total: Number(order.total),
        paymentMethod: order.paymentMethod
      };
  
      return NextResponse.json(invoiceData);
    } catch (error) {
      return NextResponse.json(
        { error: "Error al generar factura" },
        { status: 500 }
      );
    }
  }