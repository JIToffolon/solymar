import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// GET: Obtener una categoría específica
export async function GET(request, { params }) {
  try {
    const { categoryId } = params;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        children: {
          include: {
            products: true
          }
        },
        products: true
      }
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener la categoría" },
      { status: 500 }
    );
  }
}

// PATCH: Actualizar una categoría
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { categoryId } = params;
    const { name, parentId } = await request.json();

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        parentId,
        level: parentId ? 2 : 1
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Ya existe una categoría con este nombre" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al actualizar la categoría" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar una categoría
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { categoryId } = params;

    // Verificar si hay productos asociados
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        products: {
          select: { id: true }
        }
      }
    });

    if (category?.products.length > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar una categoría con productos asociados" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: categoryId }
    });

    return NextResponse.json({ message: "Categoría eliminada con éxito" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar la categoría" },
      { status: 500 }
    );
  }
}