import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const payload = await request.json();
    
    if (payload.type === 'payment') {
      const order = await prisma.orders.findFirst({
        where: { paymentId: payload.data.id }
      });

      if (!order) {
        return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
      }

      const status = payload.status === 'approved' ? 'COMPLETED' : 'FAILED';
      
      await prisma.orders.update({
        where: { id: order.id },
        data: {
          status,
          paymentMethod: payload.payment_method_id || 'mercadopago',
          installments: payload.installments || 1
        }
      });

      if (status === 'COMPLETED') {
        await prisma.cartItem.deleteMany({
          where: { cart: { userId: order.userId } }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Error procesando webhook' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}