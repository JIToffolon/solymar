const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Crear un cliente de ejemplo
  const cliente = await prisma.clientes.create({
    data: {
      nombre: 'Raul Perez',
      email: 'raul.perez@example.com',
      telefono: '1234567890',
      direccion: 'Calle Falsa 321',
    },
  });
  console.log('Cliente creado:', cliente);

  // Leer todos los clientes
  const clientes = await prisma.clientes.findMany();
  console.log('Todos los clientes:', clientes);

  // Actualizar un cliente
  const clienteActualizado = await prisma.clientes.update({
    where: { id: cliente.id },
    data: { direccion: 'Calle Verdadera 456' },
  });
  console.log('Cliente actualizado:', clienteActualizado);

  // Eliminar el cliente
  const clienteEliminado = await prisma.clientes.delete({
    where: { id: cliente.id },
  });
  console.log('Cliente eliminado:', clienteEliminado);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
