// Componente para el resumen y total del carrito

"use client";
import { useCart } from "../context/CartContext";

export default function CartSummary() {
  const { cart } = useCart();

  const total = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);

  return (
    <div className="mt-8 p-4 border-t">
      <h2 className="text-2xl font-bold text-gray-600">Total: ${total.toFixed(2)}</h2>
      <button className="bg-red-600 text-white px-4 py-2 rounded mt-4">
        Proceder al Pago
      </button>
    </div>
  );
}