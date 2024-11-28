import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const categoryId = searchParams.get('categoryId');
//     const search = searchParams.get('search');
//     const sort = searchParams.get('sort');
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '9');
//     const skip = (page - 1) * limit;

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

//     const [products, total] = await Promise.all([
//       prisma.product.findMany({
//         where,
//         orderBy: sort === 'price-asc' ? { price: 'asc' } :
//                  sort === 'price-desc' ? { price: 'desc' } :
//                  sort === 'name-asc' ? { name: 'asc' } :
//                  sort === 'stock-desc' ? { stock: 'desc' } :
//                  { createdAt: 'desc' },
//         include: {
//           category: true
//         },
//         skip,
//         take: limit
//       }),
//       prisma.product.count({ where })
//     ]);

//     return NextResponse.json({
//       products,
//       total,
//       currentPage: page,
//       totalPages: Math.ceil(total / limit)
//     });
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
      // Obtenemos la categoría sin intentar convertir el ID
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
        include: {
          children: true,
          parent: true
        }
      });

      if (category) {
        if (category.parent) {
          // Si es una subcategoría
          where.categoryId = categoryId;
        } else {
          // Si es categoría principal
          where.OR = [
            { categoryId: categoryId },
            { categoryId: { in: category.children.map(child => child.id) } }
          ];
        }
      }
    }

    if (search) {
      const searchWhere = {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } }
        ]
      };
      
      where = {
        ...where,
        AND: [
          where,
          searchWhere
        ]
      };
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
          category: {
            include: {
              parent: true
            }
          }
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
    console.error('Error detallado:', error);
    return NextResponse.json(
      { error: "Error al obtener productos", details: error.message }, 
      { status: 500 }
    );
  }
}