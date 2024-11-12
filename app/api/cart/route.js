import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function DELETE() {
  try {
    // Obtener la sesión con authOptions
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "No estás autorizado" },
        { status: 401 }
      );
    }

    // Primero intentamos obtener el ID del usuario de la sesión
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: "ID de usuario no encontrado en la sesión" },
        { status: 400 }
      );
    }

    // Buscamos el carrito existente
    const existingCart = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
      include: {
        items: true,
      },
    });

    if (!existingCart) {
      return NextResponse.json(
        { error: "Carrito no encontrado" },
        { status: 404 }
      );
    }

    // Usamos una transacción para asegurar que todas las operaciones se completen
    await prisma.$transaction(async (tx) => {
      // Eliminar todos los items del carrito
      await tx.cartItem.deleteMany({
        where: {
          cartId: existingCart.id,
        },
      });

      // Actualizar la fecha del carrito
      await tx.cart.update({
        where: {
          id: existingCart.id,
        },
        data: {
          updatedAt: new Date(),
        },
      });
    });

    return NextResponse.json({ 
      success: true,
      message: "Carrito vaciado exitosamente" 
    });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { 
        error: "Error al vaciar el carrito",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "No estás autorizado" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: "ID de usuario no encontrado en la sesión" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      // Si no existe el carrito, creamos uno nuevo
      const newCart = await prisma.cart.create({
        data: {
          userId: userId,
          items: {
            create: [],
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
      return NextResponse.json(newCart);
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { 
        error: "Error al obtener el carrito",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "No estás autorizado" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { productId, quantity } = await request.json();

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    // Buscar o crear el carrito del usuario
    let cart = await prisma.cart.findUnique({
      where: { userId: userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: userId,
        },
      });
    }

    // Verificar si el producto ya existe en el carrito
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    let updatedItem;

    if (existingItem) {
      // Actualizar cantidad si el item ya existe
      updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          product: true,
        },
      });
    } else {
      // Crear nuevo item si no existe
      updatedItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity,
        },
        include: {
          product: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      item: updatedItem,
    });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { 
        error: "Error al agregar al carrito",
        details: error.message 
      },
      { status: 500 }
    );
  }
}