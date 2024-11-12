
// app/api/products/route.js
import prisma from '@/app/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Verificar que prisma está definido
    if (!prisma) {
      throw new Error('Prisma client no está inicializado')
    }

    console.log('Intentando obtener productos...')
    
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log('Productos encontrados:', products)
    
    return NextResponse.json(products)
    
  } catch (error) {
    console.error('Error al obtener productos:', error)
    
    return NextResponse.json({ 
      error: 'Error al obtener productos',
      details: error.message 
    }, { 
      status: 500 
    })
  }
}