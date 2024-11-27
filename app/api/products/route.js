import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const categoryId = searchParams.get('categoryId');
//     const search = searchParams.get('search');
//     const sort = searchParams.get('sort');

//     let where = { active: true };

//     if (categoryId) {
//       where.OR = [
//         { categoryId },
//         { category: { parentId: categoryId } }
//       ];
//     }

//     if (search) {
//       where.OR = [
//         { name: { contains: search } },
//         { description: { contains: search } }
//       ];
//     }

//     const products = await prisma.product.findMany({
//       where,
//       orderBy: sort === 'price-asc' ? { price: 'asc' } :
//                sort === 'price-desc' ? { price: 'desc' } :
//                sort === 'name-asc' ? { name: 'asc' } :
//                sort === 'stock-desc' ? { stock: 'desc' } :
//                { createdAt: 'desc' },
//       include: {
//         category: true
//       }
//     });

//     return NextResponse.json(products);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return NextResponse.json(
//       { error: "Error al obtener productos" }, 
//       { status: 500 }
//     );
//   }
// }

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const skip = (page - 1) * limit;

    let where = { active: true };

    if (categoryId) {
      where.OR = [
        { categoryId },
        { category: { parentId: categoryId } }
      ];
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: sort === 'price-asc' ? { price: 'asc' } :
                 sort === 'price-desc' ? { price: 'desc' } :
                 sort === 'name-asc' ? { name: 'asc' } :
                 sort === 'stock-desc' ? { stock: 'desc' } :
                 { createdAt: 'desc' },
        include: {
          category: true
        },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ]);

    return NextResponse.json({
      products,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: "Error al obtener productos" }, 
      { status: 500 }
    );
  }
}