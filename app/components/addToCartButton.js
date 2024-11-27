"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShoppingBag, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AddToCartButton({ productId, stock, quantity=1 }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const addToCart = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    // Validación de stock
    if (stock === 0) {
      toast.error("Producto sin stock disponible");
      return;
    }

    if (quantity > stock) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "Stock insuficiente") {
          toast.error(`Solo hay ${data.availableStock} unidades disponibles`);
        } else {
          throw new Error(data.error || "Error adding to cart");
        }
        return;
      }

      // Mostrar feedback visual de éxito
      setAdded(true);
      toast.success("¡Producto agregado al carrito!");
      setTimeout(() => setAdded(false), 2000);

      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al agregar al carrito");
    } finally {
      setLoading(false);
    }
  };

  // Si no hay stock, mostrar botón deshabilitado
  if (stock === 0) {
    return (
      <button
        disabled
        className="relative inline-flex items-center justify-center w-36 h-10 rounded-md font-medium
                   bg-gray-100 text-gray-400 cursor-not-allowed"
      >
        <AlertCircle className="h-4 w-4 mr-2" />
        <span className="text-sm">Sin stock</span>
      </button>
    );
  }

  return (
    <button
      onClick={addToCart}
      disabled={loading || added || stock === 0}
      className={`
        relative inline-flex items-center justify-center
        w-36 h-10 rounded-md font-medium
        transition-all duration-300
        ${
          stock === 0
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : loading
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
        <ShoppingBag className="h-5 w-5" />
      </div>

     {/* Texto Boton */}
     <span
        className={`
        transition-all duration-200
        ${loading ? "opacity-0" : "opacity-100"}
        ${added ? "scale-0" : "scale-100"}
        text-sm ml-6
      `}
      >
        {loading ? "" : quantity > 1 ? `Agregar (${quantity})` : "Agregar"}
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