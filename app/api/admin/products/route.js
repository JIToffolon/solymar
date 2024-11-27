import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// GET - Listar productos
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        include: {
          category: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.product.count()
    ]);

    return NextResponse.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

// // POST - Crear producto
export async function POST(request) {
  try {
    const data = await request.json();
    const price = data.price ? parseFloat(data.price) : 0;
    const stock = data.stock ? parseInt(data.stock) : 0;

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: price,
        imageUrl: data.imageUrl,
        stock: stock,
        categoryId: data.categoryId,
        active: data.active ?? true,
        featured: data.featured ?? false
      }
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error detallado:", error);
    return NextResponse.json({ error: "Error al crear producto", details: error.message }, { status: 500 });
  }
}

// PUT - Actualizar producto
export async function PUT(request) {
  try {
    const data = await request.json();

    // Validar que el ID existe
    if (!data.id) {
      return NextResponse.json(
        { error: "ID de producto requerido" },
        { status: 400 }
      );
    }

    // Convertir precio a Decimal
    const price = data.price ? parseFloat(data.price) : 0;

    // Convertir stock a Integer
    const stock = data.stock ? parseInt(data.stock) : 0;

    const product = await prisma.product.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        price: price,
        imageUrl: data.imageUrl,
        stock: stock,
        categoryId: data.categoryId,
        active: data.active ?? true,
        featured: data.featured ?? false,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error detallado:", error);
    return NextResponse.json(
      { error: "Error al actualizar producto", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar producto
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Producto eliminado" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 }
    );
  }
}
