import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// const prisma = new PrismaClient();

// export async function GET(request, { params }) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json({ error: "No autorizado" }, { status: 401 });
//     }

//     const orderId = params.orderId;
//     const order = await prisma.orders.findUnique({
//       where: {
//         id: orderId,
//         userId: session.user.id // Asegurarse que la orden pertenece al usuario
//       },
//       include: {
//         items: {
//           include: {
//             product: true
//           }
//         }
//       }
//     });

//     if (!order) {
//       return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
//     }

//     return NextResponse.json(order);
//   } catch (error) {
//     console.error("Error fetching order:", error);
//     return NextResponse.json(
//       { error: "Error al obtener la orden" },
//       { status: 500 }
//     );
//   }
// }

const prisma = new PrismaClient();

export async function GET(request, context) {
  try {
    // Obtener la sesión
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener el orderId de manera asíncrona
    const { orderId } = await context.params;

    // Validar el orderId
    if (!orderId) {
      return NextResponse.json(
        { error: "ID de orden no proporcionado" }, 
        { status: 400 }
      );
    }

    // Buscar la orden con sus items y productos
    const order = await prisma.orders.findUnique({
      where: {
        id: orderId,
        userId: session.user.id // Verificar que la orden pertenece al usuario
      },
      include: {
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