"use client";

import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const [cartItems, setCartItems] = useState([]);

    // const addToCart = async (medicineid, quantity) => {
    //     try {
    //         const data = await axios.post(`http://localhost:10003/v1/user/add-to-cart`, {
    //             medicineid, quantity
    //         });
    //         setCartItems((prevItems) => {
    //             const existingItem = prevItems.find(item => item.medicineid === medicineid)
    //         })
    //     } catch (error) {
    //         console.error("Add to Cart failed:", error);
    //         throw error;
    //     }
    // }

  return (
    <CartContext.Provider
      value={{
   
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);

