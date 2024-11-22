"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Cart() {
  const { data: session } = useSession();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    if (session) {
      fetchCart();
    }
  }, [session]);

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Error fetching cart");
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdateLoading(itemId);
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error("Error updating quantity");
      }

      await fetchCart(); // Recargar el carrito
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError(err.message);
    } finally {
      setUpdateLoading(null);
    }
  };

  const removeItem = async (itemId) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return;
    }

    setUpdateLoading(itemId);
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error removing item");
      }

      await fetchCart(); // Recargar el carrito
    } catch (err) {
      console.error("Error removing item:", err);
      setError(err.message);
    } finally {
      setUpdateLoading(null);
    }
  };

  const clearCart = async () => {
    if (!confirm("¿Estás seguro de que quieres vaciar todo el carrito?")) {
      return;
    }

    setUpdateLoading("clear-cart");
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al vaciar el carrito");
      }

      await fetchCart();
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError(err.message);
    } finally {
      setUpdateLoading(null);
    }
  };

  if (loading)
    return (
      <div className="text-center py-8 text-red-600">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
        Cargando carrito...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-8 text-red-600 bg-red-50 rounded-lg">
        Error: {error}
      </div>
    );

  if (!cart)
    return (
      <div className="text-center py-8 text-gray-600 bg-gray-50 rounded-lg">
        No se encontró el carrito
      </div>
    );

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + Number(item.product.price) * item.quantity;
    }, 0);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Tu Carrito
      </h2>
      {cart.items.length > 0 && (
        <button
          onClick={clearCart}
          disabled={updateLoading === "clear-cart"}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
        >
          {updateLoading === "clear-cart" ? "Vaciando..." : "Vaciar carrito"}
        </button>
      )}
      {cart.items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <p className="text-gray-500 mb-6">Tu carrito está vacío</p>
          <Link
            href="/products"
            className="text-red-600 hover:text-red-700 font-medium inline-flex items-center transition-colors"
          >
            <span>Continuar comprando</span>
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border border-gray-100 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  {item.product.imageUrl && (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {item.product.name}
                    </h3>
                    <p className="text-red-600 font-medium">
                      ${Number(item.product.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 ml-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={updateLoading === item.id}
                      className="px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium text-gray-700">
                      {updateLoading === item.id ? "..." : item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={updateLoading === item.id}
                      className="px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={updateLoading === item.id}
                    className="text-gray-500 hover:text-red-600 disabled:text-gray-300 transition-colors"
                  >
                    {updateLoading === item.id ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-red-600">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 font-medium transition-colors shadow-sm hover:shadow-md"
            >
              Proceder al pago
            </button>
          </div>
        </>
      )}
    </div>
  );
}