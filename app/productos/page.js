
import React from "react";
import prisma from "../lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function ProductosPage() {
  const productos = await prisma.productos.findMany();
  const productoToNumber = productos.map((producto) => ({
    ...producto,
    precio: producto.precio.toNumber(),
  }));
  return (
    <div className="products-page">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-700">
        Nuestros Productos
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-8">
        {productoToNumber.map((producto) => (
          <div
            key={producto.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="relative w-full h-64">
              <Link href={`/productos/${producto.id}`}>
                <Image
                  src={`${producto.imagen_url}`}
                  alt={`${producto.descripcion}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="transform hover:scale-105 transition duration-300 object-contain"
                />
              </Link>
            </div>
            <div className="p-4 text-center">
              <h2 className="text-xl text-gray-600 font-bold mb-2">
                {producto.nombre}
              </h2>
              <p className="text-gray-600 mb-4">{producto.descripcion}</p>
              <p className="text-lg text-gray-600">
                Precio: ${producto.precio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
