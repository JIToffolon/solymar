const { PrismaClient } = require ('@prisma/client');

const prisma = new PrismaClient();

async function deleteOrdersWithoutRelations() {
  try {
    // Eliminar órdenes que no tienen relaciones
    const result = await prisma.orders.deleteMany({
      where: {
        AND: [
          {
            items: {
              none: {}, // Órdenes sin ningún OrderItem
            },
          },
          {
            paymentDetails: {
              is: null, // Órdenes sin PaymentDetails
            },
          },
        ],
      },
    });

    console.log(`${result.count} órdenes sin relaciones fueron eliminadas exitosamente.`);
  } catch (error) {
    console.error('Error al eliminar las órdenes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
deleteOrdersWithoutRelations();
