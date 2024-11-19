import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// Modificar cantidad
export async function PATCH(request, props) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { itemId } = params;
    const { quantity } = await request.json();

    // Verificar que el item pertenece al carrito del usuario
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId: session.user.id
        }
      }
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Actualizar cantidad
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: quantity }
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Error updating item' }, { status: 500 });
  }
}

// Eliminar item
export async function DELETE(request, props) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { itemId } = params;

    // Verificar que el item pertenece al carrito del usuario
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId: session.user.id
        }
      }
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Eliminar item
    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json({ error: 'Error deleting item' }, { status: 500 });
  }
}
