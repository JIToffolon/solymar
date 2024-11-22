// app/api/admin/categories/route.js
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
// GET - Listar categorías
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true
      }
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 });
  }
}

// POST - Crear categoría
export async function POST(request) {
  try {
    const data = await request.json();
    const category = await prisma.category.create({
      data: {
        name: data.name
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
      data: { name: data.name }
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
    await prisma.category.delete({
      where: { id }
    });
    return NextResponse.json({ message: "Categoría eliminada" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar categoría" }, { status: 500 });
  }
}