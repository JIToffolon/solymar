import prisma from "@/app/lib/prisma";
import ProductDetails from "@/app/components/ProductDetails";

export default async function ProductPage({ params }) {
  const { id } = await params;
  const producto = await prisma.productos.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  
  if (!producto) {
    return <p>Producto no encontrado</p>;
  }
  
  return <ProductDetails producto={producto} />;
}