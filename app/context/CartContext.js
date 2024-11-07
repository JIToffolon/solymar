// Estado global para gestionar el carrito
"use client";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

// export const CartContext = createContext();

// export const CartProvider = ({children}) =>{

//     const [cartItems,setCartItems] = useState([]);
//     const [total, setTotal] = useState(0);

//     useEffect(()=>{
//         //Obtener el carrito del usuario actual al cargar la app

//         const fethCart = async()=>{
//             const response = await axios.get('/api/cart');
//             setCartItems(response.data);
//             calculateTotal();
//         };

//         fethCart();

//     },[]);

//     const addTocart = async (productId,quantity) => {
//         try {
//             //Verifica si el producto ya está en el carrito
//             const existingItem = cartItems.find((item)=>item.producto_id === productId);
//             if(existingItem){
//                 await updateQuantity(existingItem.id,quantity);
//             }else{

//             const response = await axios.post('api/cart',{producto_id:productId, cantidad:quantity});
//             setCartItems([...cartItems,response.data]);
//             };

//             calculateTotal();

//         } catch (error) {
//             console.error('Error al ingresar producto al carrito', error);
//         }
//     };

//     const removeFromCart = async(id)=>{
//         try {
//             await axios.delete(`api/cart/${id}`);
//             const updatedCart = cartItems.filter((item)=>item.id!==id);
//             setCartItems(updatedCart);
//             calculateTotal();
//         } catch (error) {
//             console.error('Error al eliminar producto del carrito', error);
//         }
//     };

//     const updateQuantity = async (id,newQuantity) =>{

//         try {
//             const response = await axios.put (`api/car/${id}`, {cantidad:newQuantity});
//             const updatedCart = cartItems.map((item)=> (item.id === id ? response.data : item));
//             setCartItems(updatedCart);
//             calculateTotal();
//         } catch (error) {
//             console.error('Error al modificar la cantidad del producto',error);
//         }

//     };

//     const calculateTotal = () => {
//         const total = cartItems.reduce((acc,item)=> acc + (item.productos.precio*item.cantidad),0);
//         setTotal(total);
//     };

//     return (
//         <CartContext.Provider value={{cartItems,total,addTocart,removeFromCart,updateQuantity}}>
//             {children}
//         </CartContext.Provider>
//     )

// };

// components/CartContext.js

///////////////////////////////////////////////////////////////
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // useEffect(() => {
  //   const fetchCart = async () => {
  //     const response = await axios.get("/api/cart");

  //     setCartItems(response.data);
  //     console.log(response.data);
  //     calculateTotal(response.data);
  //   };
  //   fetchCart();
  // }, []);

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
