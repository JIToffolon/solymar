import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { payment_method, formData, preferenceId } = await request.json();
    console.log("📦 Datos recibidos:", { payment_method, formData, preferenceId });
    
    if (!formData || !formData.payment_method_id) {
      return NextResponse.json({ 
        error: "Datos de pago incompletos" 
      }, { status: 400 });
    }

    // Obtener el carrito
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

    if (!cart || !cart.items.length) {
      return NextResponse.json({ 
        error: "Carrito vacío o no encontrado" 
      }, { status: 400 });
    }

    // Calcular el total del carrito
    const total = cart.items.reduce(
      (sum, item) => sum + (Number(item.product.price) * item.quantity),
      0
    );

    // Configurar MercadoPago
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MP_ACCESS_TOKEN
    });

    const paymentApi = new Payment(client);

    const paymentData = {
      transaction_amount: total,
      token: formData.token,
      description: "Compra en Solymar Hogar",
      installments: Number(formData.installments),
      payment_method_id: formData.payment_method_id,
      issuer_id: formData.issuer_id,
      payer: {
        email: session.user.email,
        identification: formData.payer.identification,
        first_name: session.user.name || 'Not Provided'
      },
      additional_info: {
        items: cart.items.map(item => ({
          id: item.product.id,
          title: item.product.name,
          description: item.product.description || item.product.name,
          category_id: item.product.categoryId,
          quantity: item.quantity,
          unit_price: Number(item.product.price)
        }))
      },
      metadata: {
        user_id: session.user.id,
        cart_id: cart.id,
        preference_id: preferenceId
      }
    };

    console.log("Procesando pago...");

    // Crear el pago
    const payment = await paymentApi.create({ 
      body: paymentData,
      headers: {
        'X-Idempotency-Key': uuidv4()
      }
    });

    console.log("Respuesta del pago:", payment);

    try {
      // Crear la orden y sus items en una transacción
      const result = await prisma.$transaction(async (tx) => {
        // Crear la orden siempre como pending
        const order = await tx.orders.create({
          data: {
            userId: session.user.id,
            status: "pending", // Siempre pending inicialmente
            paymentId: payment.id.toString(),
            total: new Decimal(total),
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

        console.log("Orden creada:", order);

        // Crear detalles del pago
        await tx.paymentDetails.create({
          data: {
            orderId: order.id,
            paymentType: payment.payment_method_id,
            expirationDate: payment.date_of_expiration,
            paymentInstructions: payment.transaction_details || {},
            additionalData: {
              point_of_interaction: payment.point_of_interaction,
              status_detail: payment.status_detail,
              ...payment.additional_info
            }
          }
        });

        return order;
      });

      console.log("Transacción completada:", result);

      return NextResponse.json({
        status: "pending",
        id: payment.id.toString(),
        order_id: result.id,
        payment_method: payment.payment_method_id,
        payment_type: payment.payment_type_id,
        transaction_details: payment.transaction_details,
        point_of_interaction: payment.point_of_interaction
      });

    } catch (dbError) {
      console.error("Error en base de datos:", dbError);
      return NextResponse.json({ 
        error: "Error al procesar la orden",
        details: dbError.message 
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Error en el proceso de pago:", error);
    return NextResponse.json({ 
      error: "Error al procesar el pago",
      details: error.message 
    }, { status: 500 });
  }
}