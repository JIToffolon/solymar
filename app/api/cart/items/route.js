import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { productId, quantity } = await request.json();

    // Obtener el carrito del usuario
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    // Verificar si el item ya existe en el carrito
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    if (existingItem) {
      // Actualizar cantidad si el item ya existe
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
      return NextResponse.json(updatedItem);
    }

    // Crear nuevo item si no existe
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: productId,
        quantity: quantity,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    return NextResponse.json(
      { error: "Error adding item to cart" },
      { status: 500 }
    );
  }
}
