import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";


export async function GET(request, { params }) {
  try {
     // Obtenemos el id directamente del objeto params
     const {orderId } = await params;
    console.log("API recibió orderId:", orderId); // Para debug
    const order = await prisma.orders.findUnique({
      where: { 
        id: orderId 
      },
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Error al obtener la orden" }, 
      { status: 500 }
    );
  }
}

// También podemos agregar el endpoint PUT para actualizar el estado de la orden
export async function PUT(request, { params }) {
  try {
    const {orderId } = await params;
    const data = await request.json();

    const order = await prisma.orders.update({
      where: { 
        id: orderId 
      },
      data: {
        status: data.status
      },
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Error al actualizar la orden" }, 
      { status: 500 }
    );
  }
}