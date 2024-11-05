// Estado global para gestionar el carrito
'use client';
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({children}) =>{

    const [cart,setCart] = useState([]);

    const addTocart = (producto) =>{

        setCart((prevCart)=>{
            const existingProduct = prevCart.find((item)=>item.id===producto.id);
            if(existingProduct){
                return prevCart.map((item)=>item.id===producto.id?{...item, quantity:item.quantity+1}:item)
            }
        })
        return [...prevCart,{...producto,quantity:1}];
    };


    const removeFromCart = (productoId) =>{

        setCart((prevCart)=>prevCart.filter((item)=>item.id !== productoId));

    };

    const updateQuantity = (productoId,quantity)=>{
        setCart((prevCart) =>
            prevCart.map((item) =>
              item.id === productoId ? { ...item, quantity } : item
            )
          );
    };

    return (
        <CartContext.Provider value={{cart,addTocart,removeFromCart,updateQuantity}}>
            {children}
        </CartContext.Provider>
    )


};

export const useCart = () => useContext(CartContext);