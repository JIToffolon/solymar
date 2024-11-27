import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// GET: Obtener todas las categorías con su jerarquía
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        level: 1  // Solo categorías principales
      },
      include: {
        children: {
          include: {
            products: true
          }
        },
        products: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return NextResponse.json(
      { error: "Error al obtener las categorías" },
      { status: 500 }
    );
  }
}

// POST: Crear nueva categoría (requiere autenticación de admin)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { name, parentId } = await request.json();
    
    // Verificar que el nombre no esté vacío
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: "El nombre de la categoría es requerido" },
        { status: 400 }
      );
    }

    // Crear la categoría
    const category = await prisma.category.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        parentId: parentId || null,
        level: parentId ? 2 : 1
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error al crear categoría:', error);
    
    // Manejar error de nombre duplicado
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Ya existe una categoría con este nombre" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al crear la categoría" },
      { status: 500 }
    );
  }
}