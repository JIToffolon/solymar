import prisma from "../../lib/prisma";




export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      await getCart(req, res);
      break;
    case 'POST':
      await addToCart(req, res);
      break;
    case 'PUT':
      await updateCartItem(req, res);
      break;
    case 'DELETE':
      await removeFromCart(req, res);
      break;
    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getCart(req, res) {
  // const userId = req.session.user.id; // Assuming you have user session information
  const cartItems = await prisma.cart.findMany({
    // where: { userId },
    include: { productos: true },
  });
  res.status(200).json(cartItems);
}

async function addToCart(req, res) {
  const { producto_id, cantidad } = req.body;
  // const userId = req.session.user.id;
  const newCartItem = await prisma.cart.create({
    data: {
      // userId,
      producto_id: producto_id,
      cantidad,
    },
    include: { productos: true },
  });
  res.status(201).json(newCartItem);
}

async function updateCartItem(req, res) {
  const { id } = req.query;
  const { cantidad } = req.body;
  const updatedCartItem = await prisma.cart.update({
    where: { id: parseInt(id) },
    data: { cantidad },
    include: { productos: true },
  });
  res.status(200).json(updatedCartItem);
}

async function removeFromCart(req, res) {
  const { id } = req.query;
  await prisma.cart.delete({
    where: { id: parseInt(id) },
  });
  res.status(204).end();
}
