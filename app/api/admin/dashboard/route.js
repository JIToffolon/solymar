import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Get total orders and sales
    const totalOrdersAndSales = await prisma.orders.aggregate({
      _count: {
        id: true,
      },
      _sum: {
        total: true,
      },
    });

    // Get pending orders count
    const pendingOrders = await prisma.orders.count({
      where: {
        status: 'pending'
      }
    });

    // Get recent orders
    const recentOrders = await prisma.orders.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true
      }
    });

    // Get sales by status
    const salesByStatus = await prisma.orders.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    // Get monthly sales for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await prisma.orders.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sixMonthsAgo
        },
        status: 'approved'
      },
      _sum: {
        total: true
      }
    });

    // Format the data for the frontend
    const formattedMonthlySales = monthlySales.map(sale => ({
      month: new Date(sale.createdAt).toLocaleString('default', { month: 'short' }),
      sales: Number(sale._sum.total)
    }));

    return NextResponse.json({
      totalOrders: totalOrdersAndSales._count.id,
      totalSales: Number(totalOrdersAndSales._sum.total || 0),
      pendingOrders,
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        customerEmail: order.user.email,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt
      })),
      salesByStatus: salesByStatus.map(status => ({
        name: status.status,
        value: status._count.id
      })),
      monthlySales: formattedMonthlySales
    });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Error al obtener datos del dashboard" },
      { status: 500 }
    );
  }
}