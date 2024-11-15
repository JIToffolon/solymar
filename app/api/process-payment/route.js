// app/api/process-payment/route.js
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";


export async function POST(req) {
  try {
    // Verificar sesión
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: 'No autorizado' });
    }

    // Obtener carrito
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: { include: { product: true } } }
    });

    if (!cart?.items.length) {
      return NextResponse.json({ success: false, message: 'Carrito vacío' });
    }

    // Procesar pago
    const total = cart.items.reduce((sum, item) => {
      return sum + (Number(item.product.price) * item.quantity);
    }, 0);

    const body = await req.json();
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN
    });

    const payment = new Payment(client);
    const paymentData = {
      transaction_amount: Number(total),
      token: body.formData.formData.token,
      description: `Compra en Solymar Hogar`,
      installments: Number(body.formData.formData.installments),
      payment_method_id: body.formData.formData.payment_method_id,
      issuer_id: body.formData.formData.issuer_id,
      payer: { email: "comprador@gmail.com" }
    };

    const result = await payment.create({ body: paymentData });

    if (result.status === 'approved') {
      // Crear orden base
      const order = await prisma.orders.create({
        data: {
          userId: session.user.id,
          status: result.status,
          paymentId: result.id.toString(),
          total: new Decimal(total),
          installments: Number(body.formData.formData.installments),
          paymentMethod: body.formData.formData.payment_method_id
        }
      });

      // Crear items uno por uno
      for (const item of cart.items) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.product.id,
            quantity: item.quantity,
            price: new Decimal(item.product.price.toString())
          }
        });
      }

      // Limpiar carrito
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return NextResponse.json({
        success: true,
        status: 'approved',
        orderId: order.id
      });
    }

    return NextResponse.json({
      success: false,
      status: result.status,
      message: 'El pago no fue aprobado'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error en el proceso de pago: ' + error.message
    });
  }
}