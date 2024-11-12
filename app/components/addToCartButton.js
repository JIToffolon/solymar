"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ productId }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const addToCart = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      if (!response.ok) throw new Error("Error adding to cart");

      // Mostrar feedback visual de éxito
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);

      router.refresh();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={addToCart}
      disabled={loading || added}
      className={`
        relative inline-flex items-center justify-center
        w-36 h-10 rounded-md font-medium
        transition-all duration-300
        ${
          loading
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : added
            ? "bg-green-500 text-white"
            : "bg-red-600 hover:bg-red-700 text-white hover:shadow-md"
        }
        ${added ? "scale-105" : "scale-100"}
      `}
    >
      {/* Icono del carrito */}
      <div
        className={`
        absolute left-3 
        ${added || loading ? "opacity-0" : "opacity-100"}
        transition-opacity duration-200
      `}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      </div>
       {/* Texto del botón */}
      <span
        className={`
        transition-all duration-200
        ${loading ? "opacity-0" : "opacity-100"}
        ${added ? "scale-0" : "scale-100"}
        text-sm ml-6
      `}
      >
        {loading ? "" : "Añadir"}
      </span>

      {/* Estado de carga */}
      {loading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Mensaje de éxito */}
      <span
        className={`
        absolute inset-0 flex items-center justify-center text-sm
        ${added ? "scale-100 opacity-100" : "scale-0 opacity-0"}
        transition-all duration-200
      `}
      >
        ¡Agregado!
      </span>
    </button>
  );
}
