"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

export function useCart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autorizado");

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      await fetchCart(); // Actualizar el carrito después de agregar
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autorizado");

      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      await fetchCart(); // Actualizar el carrito después de modificar
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autorizado");

      const res = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      await fetchCart(); // Actualizar el carrito después de eliminar
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  return {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
  };
}
