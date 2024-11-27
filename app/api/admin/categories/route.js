// app/api/admin/categories/route.js
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// GET - Listar categorías con jerarquía
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where: {
          level: 1
        },
        include: {
          products: true,
          children: {
            include: {
              products: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        },
        skip,
        take: limit
      }),
      prisma.category.count({
        where: { level: 1 }
      })
    ]);

    return NextResponse.json({
      categories,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 });
  }
}

// POST - Crear categoría o subcategoría
export async function POST(request) {
  try {
    const data = await request.json();
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        parentId: data.parentId || null,
        level: data.parentId ? 2 : 1
      },
      include: {
        children: true,
        products: true
      }
    });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: "Error al crear categoría" }, { status: 500 });
  }
}

// PUT - Actualizar categoría
export async function PUT(request) {
  try {
    const data = await request.json();
    const category = await prisma.category.update({
      where: { id: data.id },
      data: { 
        name: data.name,
        slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        parentId: data.parentId,
        level: data.parentId ? 2 : 1
      },
      include: {
        children: true,
        products: true
      }
    });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar categoría" }, { status: 500 });
  }
}

// DELETE - Eliminar categoría
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Verificar si tiene productos o subcategorías
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
        children: true
      }
    });

    if (category.products.length > 0) {
      return NextResponse.json({ 
        error: "No se puede eliminar una categoría con productos" 
      }, { status: 400 });
    }

    if (category.children.length > 0) {
      return NextResponse.json({ 
        error: "No se puede eliminar una categoría con subcategorías" 
      }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: "Categoría eliminada" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar categoría" }, { status: 500 });
  }
}