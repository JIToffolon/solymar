// Componente para cada producto en el carrito
'use client';
import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div>
        <h2 className="text-lg font-bold">{item.nombre}</h2>
        <p>${item.precio}</p>
      </div>
      <div className="flex items-center">
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
          className="w-16 border rounded px-2"
          min="1"
        />
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-600 ml-4"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
