// Estado global para gestionar el carrito
"use client";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const addToCart = async (productId, quantity) => {
    try {
      const response = await axios.post("/api/cart", {
        producto_id: productId,
        cantidad: quantity,
      });
      const newCartItems = [...cartItems, response.data];
      setCartItems(newCartItems);
      calculateTotal(newCartItems);
    } catch (error) {
      console.error("Error adding product to cart", error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      await axios.delete(`/api/cart/${id}`);
      const updatedCart = cartItems.filter((item) => item.id !== id);
      setCartItems(updatedCart);
      calculateTotal(updatedCart);
    } catch (error) {
      console.error("Error removing product from cart", error);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    try {
      const response = await axios.put(`/api/cart/${id}`, {
        cantidad: newQuantity,
      });
      const updatedCart = cartItems.map((item) =>
        item.id === id ? response.data : item
      );
      setCartItems(updatedCart);
      calculateTotal(updatedCart);
    } catch (error) {
      console.error("Error updating product quantity", error);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce(
      (acc, item) => acc + item.productos.precio * item.cantidad,
      0
    );
    setTotal(total);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, total, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};
