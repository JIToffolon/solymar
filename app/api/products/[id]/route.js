import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";


  export async function GET(request, context) {
    try {
      const {id} = await context.params; // Extraemos el ID de context.params
      console.log("Buscando producto con ID:", id);
  
      const product = await prisma.product.findUnique({
        where: {
          id: id
        }
      });
  
      if (!product) {
        return NextResponse.json(
          { error: "Producto no encontrado" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(product);
    } catch (error) {
      console.error("Error en el servidor:", error);
      return NextResponse.json(
        { error: "Error al obtener el producto", details: error.message },
        { status: 500 }
      );
    }
  }