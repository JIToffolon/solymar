// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import { MercadoPagoConfig, Payment } from "mercadopago";

// const prisma = new PrismaClient();
// const client = new MercadoPagoConfig({
//   accessToken: process.env.MP_ACCESS_TOKEN
// });

// export async function POST(request) {
//   console.log("Webhook recibido de Mercado Pago");

//   try {
//     const body = await request.json();
//     console.log("Datos recibidos:", body);

//     if (body.type !== "payment") {
//       return NextResponse.json({ message: "Notificación no relacionada con pagos" });
//     }

//     // Obtener la orden
//     const order = await prisma.orders.findFirst({
//       where: {
//         paymentId: body.data.id.toString()
//       },
//       include: {
//         items: {
//           include: {
//             product: true
//           }
//         }
//       }
//     });

//     console.log("Orden encontrada:", order);

//     if (!order) {
//       return NextResponse.json({
//         message: "Orden no encontrada",
//         paymentId: body.data.id
//       });
//     }

//     // Obtener información del pago
//     const paymentApi = new Payment(client);
//     const payment = await paymentApi.get({ id: body.data.id });
//     console.log("Estado del pago:", payment.status);

//     // Solo procesar si el pago está aprobado y la orden está pendiente
//     if (payment.status === "approved" && order.status === "pending") {
//       console.log("Procesando orden pendiente:", order.id);

//       try {
//         await prisma.$transaction(async (tx) => {
//           // 1. Actualizar estado de la orden
//           await tx.orders.update({
//             where: { id: order.id },
//             data: { status: "approved" }
//           });

//           // 2. Actualizar stock y registrar movimientos
//           for (const item of order.items) {
//             const newStock = item.product.stock - item.quantity;

//             if (newStock < 0) {
//               throw new Error(`Stock insuficiente para el producto ${item.product.name}`);
//             }

//             // Actualizar stock
//             await tx.product.update({
//               where: { id: item.productId },
//               data: { stock: newStock }
//             });

//             // Registrar movimiento
//             await tx.stockMovement.create({
//               data: {
//                 productId: item.productId,
//                 quantity: -item.quantity,
//                 reason: `Venta - Orden ${order.id}`,
//                 movementType: "SALE",
//                 orderId: order.id
//               }
//             });
//           }

//   // 3. Limpiar el carrito
//   await tx.cartItem.deleteMany({
//     where: { cart: { userId: order.userId } }
//   });
// });

//         console.log("Orden procesada y stock actualizado:", order.id);

//       } catch (error) {
//         console.error("Error en la transacción:", error);
//         throw error;
//       }
//     } else {
//       console.log(`Orden no procesable: Estado pago=${payment.status}, Estado orden=${order.status}`);
//     }

//     return NextResponse.json({
//       message: "Notificación procesada",
//       orderId: order.id,
//       status: payment.status
//     });

//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       { error: "Error procesando notificación", details: error.message },
//       { status: 500 }
//     );
//   }
// }

// export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("📦 Webhook recibido:", JSON.stringify(body, null, 2));

    if (body.type !== "payment") {
      return NextResponse.json({
        message: "Notificación no relacionada con pagos",
      });
    }

    // Obtener detalles del pago desde Mercado Pago
    try {
      console.log("🔍 Consultando pago en MP:", body.data.id);

      const mpResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${body.data.id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );

      if (!mpResponse.ok) {
        throw new Error(`Error al obtener pago de MP: ${mpResponse.status}`);
      }

      const paymentInfo = await mpResponse.json();
      console.log(
        "💰 Información completa del pago:",
        JSON.stringify(paymentInfo, null, 2)
      );

      // Buscar la orden relacionada
      const order = await prisma.orders.findFirst({
        where: { paymentId: body.data.id.toString() },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        console.error(` Orden no encontrada para el pago ${body.data.id}`);
        return NextResponse.json(
          { error: "Orden no encontrada" },
          { status: 404 }
        );
      }

      console.log("📦 Estado actual de la orden:", {
        orderId: order.id,
        currentStatus: order.status,
        newStatus: paymentInfo.status,
      });

      // Actualizar el estado de la orden
      try {
        await prisma.$transaction(async (tx) => {
          // Actualizar orden
          await tx.orders.update({
            where: { id: order.id },
            data: {
              status: paymentInfo.status,
              paymentDetails: {
                upsert: {
                  create: {
                    paymentType: paymentInfo.payment_type_id,
                    additionalData: paymentInfo,
                  },
                  update: {
                    additionalData: paymentInfo,
                  },
                },
              },
            },
          });

          // Si el pago está aprobado, procesar stock
          if (paymentInfo.status === "approved") {
            console.log(" Procesando stock para orden aprobada");

            for (const item of order.items) {
              const newStock = item.product.stock - item.quantity;
              if (newStock < 0) {
                throw new Error(`Stock insuficiente para ${item.product.name}`);
              }

              await tx.product.update({
                where: { id: item.productId },
                data: { stock: newStock },
              });

              await tx.stockMovement.create({
                data: {
                  productId: item.productId,
                  quantity: -item.quantity,
                  reason: `Venta - Orden ${order.id}`,
                  movementType: "SALE",
                  orderId: order.id,
                },
              });

              // 3. Limpiar el carrito
              await tx.cartItem.deleteMany({
                where: { cart: { userId: order.userId } },
              });
            }
          }
        });

        console.log("✨ Orden actualizada correctamente");

        return NextResponse.json({
          message: "Notificación procesada correctamente",
          orderId: order.id,
          status: paymentInfo.status,
        });
      } catch (txError) {
        console.error(" Error en la transacción:", txError);
        throw txError;
      }
    } catch (paymentError) {
      console.error(" Error obteniendo información del pago:", paymentError);
      throw paymentError;
    }
  } catch (error) {
    console.error("Error general:", error);
    return NextResponse.json(
      {
        error: "Error procesando la notificación",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
