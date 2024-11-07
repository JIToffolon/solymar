// components/ProductDetails.js
'use client';
import React from "react";
import Image from "next/image";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function ProductDetails({ producto }) {
  // Convertir el precio a número (asumiendo que es necesario)
  const productoToNumber = {
    ...producto,
    // precio: producto.precio.toNumber(),
  };
  
  const {addToCart} = useContext(CartContext);
  const handleAddToCart = () =>{
    addToCart(producto.id)
  }

  return (
    <div className="container mx-auto py-8 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-80 md:h-[500px]">
          <Image
            src={productoToNumber.imagen_url}
            alt={productoToNumber.nombre}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-lg object-contain"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4 text-gray-700">{productoToNumber.nombre}</h1>
          <p className="text-gray-600 mb-4">{productoToNumber.descripcion}</p>
          <p className="text-2xl font-semibold mb-4 text-gray-600">
            Precio: ${productoToNumber.precio}
          </p>
          <button
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300"
            onClick={handleAddToCart}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
