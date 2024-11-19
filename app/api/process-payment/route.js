import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";


// const prisma = new PrismaClient();

// export async function POST(request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json({ error: "No autorizado" }, { status: 401 });
//     }

//     const data = await request.json();
//     console.log("Datos recibidos en el backend:", data);

//     const { formData } = data;

//     if (!formData || !formData.payment_method_id) {
//       return NextResponse.json(
//         {
//           error: "Datos de pago incompletos",
//         },
//         { status: 400 }
//       );
//     }

//     // 1. Obtener el carrito actual
//     const cart = await prisma.cart.findUnique({
//       where: { userId: session.user.id },
//       include: {
//         items: {
//           include: {
//             product: true,
//           },
//         },
//       },
//     });

//     // Debug logs
//     console.log("Cart Item completo:", cart.items[0]);
//     console.log("Producto del Cart Item:", cart.items[0].product);
//     console.log("Carrito encontrado:", cart);

//     if (!cart || !cart.items.length) {
//       return NextResponse.json(
//         {
//           error: "Carrito vacío o no encontrado",
//         },
//         { status: 400 }
//       );
//     }

//     // 2. Procesar el pago con Mercado Pago
//     const client = new MercadoPagoConfig({
//       accessToken: process.env.MP_ACCESS_TOKEN,
//     });

//     const paymentApi = new Payment(client);

//     const paymentData = {
//       transaction_amount: Number(formData.transaction_amount),
//       token: formData.token,
//       description: "Compra en eCommerce",
//       installments: Number(formData.installments),
//       payment_method_id: formData.payment_method_id,
//       issuer_id: formData.issuer_id,
//       payer: {
//         email: formData.payer.email,
//         identification: formData.payer.identification,
//       },
//     };

//     console.log("Datos de pago a enviar:", paymentData);

//     const payment = await paymentApi.create({
//       body: paymentData,
//       headers: {
//         "X-Idempotency-Key": uuidv4(),
//       },
//     });

//     console.log("Respuesta del pago:", payment);

//     // 3. Crear la orden y sus items usando una transacción
//     try {
//       const result = await prisma.$transaction(async (tx) => {
//         // Crear la orden base
//         const order = await tx.orders.create({
//           data: {
//             userId: session.user.id,
//             status: payment.status,
//             paymentId: payment.id.toString(),
//             total: new Decimal(formData.transaction_amount),
//             installments: payment.installments || 1,
//             paymentMethod: payment.payment_method_id,
//           },
//         });

//         console.log("Orden base creada:", order);

//         // Preparar los datos de los items
//         const itemsData = cart.items.map((item) => {
//           const itemData = {
//             orderId: order.id,
//             productId: item.product.id,
//             quantity: item.quantity,
//             price: new Decimal(item.product.price),
//           };

//           console.log("Item preparado:", itemData);
//           return itemData;
//         });

//         // Crear los items uno por uno
//         for (const itemData of itemsData) {
//           const orderItem = await tx.orderItem.create({
//             data: itemData,
//           });
//           console.log("Item creado:", orderItem);
//         }

//         // Verificar la orden completa
//         const completeOrder = await tx.orders.findUnique({
//           where: { id: order.id },
//           include: {
//             items: true,
//           },
//         });

//         console.log("Orden completa:", completeOrder);
//         return completeOrder;
//       });

//       console.log("Transacción completada exitosamente:", result);

//       // Limpiar el carrito si el pago fue exitoso
//       if (payment.status === "approved") {
//         await prisma.cartItem.deleteMany({
//           where: { cartId: cart.id },
//         });
//       }

//       return NextResponse.json({
//         status: payment.status,
//         status_detail: payment.status_detail,
//         id: payment.id.toString(),
//         order_id: result.id,
//         order_details: result,
//       });
//     } catch (dbError) {
//       console.error("Error específico en base de datos:", {
//         message: dbError.message,
//         code: dbError.code,
//         meta: dbError.meta,
//       });

//       return NextResponse.json(
//         {
//           error: "Error al procesar la orden",
//           details: dbError.message,
//         },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("Error en el proceso completo:", error);
//     return NextResponse.json(
//       {
//         error: "Error al procesar el pago",
//         details: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await request.json();
    console.log("Datos recibidos en el backend:", data);

    const { formData } = data;
    
    if (!formData || !formData.payment_method_id) {
      return NextResponse.json({ 
        error: "Datos de pago incompletos" 
      }, { status: 400 });
    }

    // 1. Obtener el carrito actual
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { 
        items: {
          include: {
            product: true
          }
        } 
      }
    });

    console.log("Carrito encontrado:", cart);

    if (!cart || !cart.items.length) {
      return NextResponse.json({ 
        error: "Carrito vacío o no encontrado" 
      }, { status: 400 });
    }

    // 2. Procesar el pago con Mercado Pago
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MP_ACCESS_TOKEN
    });

    const paymentApi = new Payment(client);

    const paymentData = {
      transaction_amount: Number(formData.transaction_amount),
      token: formData.token,
      description: "Compra en eCommerce",
      installments: Number(formData.installments),
      payment_method_id: formData.payment_method_id,
      issuer_id: formData.issuer_id,
      payer: {
        email: formData.payer.email,
        identification: formData.payer.identification
      }
    };

    console.log("Datos de pago a enviar:", paymentData);

    const payment = await paymentApi.create({ 
      body: paymentData,
      headers: {
        'X-Idempotency-Key': uuidv4()
      }
    });

    console.log("Respuesta del pago:", payment);

    // 3. Crear la orden y sus items usando una transacción
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Crear la orden con sus items en una sola operación
        const order = await tx.orders.create({
          data: {
            userId: session.user.id,
            status: payment.status,
            paymentId: payment.id.toString(),
            total: new Decimal(formData.transaction_amount),
            installments: payment.installments || 1,
            paymentMethod: payment.payment_method_id,
            items: {
              create: cart.items.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                price: new Decimal(item.product.price)
              }))
            }
          },
          include: {
            items: true
          }
        });

        console.log("Orden creada con items:", order);
        return order;
      });

      console.log("Transacción completada exitosamente:", result);

      // Limpiar el carrito si el pago fue exitoso
      if (payment.status === 'approved') {
        await prisma.cartItem.deleteMany({
          where: { cartId: cart.id }
        });
      }

      return NextResponse.json({
        status: payment.status,
        status_detail: payment.status_detail,
        id: payment.id.toString(),
        order_id: result.id,
        order_details: result
      });

    } catch (dbError) {
      console.error("Error específico en base de datos:", {
        message: dbError.message,
        code: dbError.code,
        meta: dbError.meta
      });
      
      return NextResponse.json({ 
        error: "Error al procesar la orden",
        details: dbError.message 
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Error en el proceso completo:", error);
    return NextResponse.json({ 
      error: "Error al procesar el pago",
      details: error.message 
    }, { status: 500 });
  }
}
