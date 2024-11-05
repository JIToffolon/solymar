'use client';
import React from "react";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
// Página principal del carrito de compras
export default function CarritoPage() {
  const { cart } = useCart();
  return (
    <div className="text-center">
      <h1 className="font-bold text-gray-700 text-2xl">Carrito de Compras</h1>
      <p className="text-gray-600 text-lg">
        Aquí puedes ver los productos añadidos a tu carrito.
      </p>
      <div className="container mx-auto py-8">
        <div className="grid gap-8">
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <CartSummary />
      </div>
    </div>
  );
}
