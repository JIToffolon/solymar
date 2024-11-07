// Componente para cada producto en el carrito
'use client';
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useContext(CartContext);
  const handleQuantityChange = (e) =>{
    updateQuantity(item.id,e.target.value)
  };
  const handleRemoveCartItem = () => {
    removeFromCart(item.id);
  }


  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div>
        <h2 className="text-lg font-bold">${item.productos.nombre}</h2>
        <p>${item.productos.precio}</p>
      </div>
      <div className="flex items-center">
        <input
          type="number"
          value={item.cantidad}
          onChange={handleQuantityChange}
          className="w-16 border rounded px-2"
          min="1"
        />
        <button
          onClick={handleRemoveCartItem}
          className="text-red-600 ml-4"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
