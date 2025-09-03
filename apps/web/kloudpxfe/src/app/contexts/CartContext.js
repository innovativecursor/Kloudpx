"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { postAxiosCall, getAxiosCall, deleteAxiosCall } from "@/app/lib/axios";
import endpoints from "../config/endpoints";
import { useCheckout } from "./CheckoutContext";
import { usePathname } from "next/navigation";
import { useLoginAuth } from "./LoginAuth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const pathname = usePathname();
  const { doCheckout, addDeliveryData } = useCheckout();
  const { openLogin } = useLoginAuth();
  const [cartItems, setCartItems] = useState([]);

  const [getCartData, setGetCartData] = useState({ data: [], loading: false });

  const addToCart = async (medicineid, quantity) => {
    if (!token) {
      openLogin();
      return;
    }

    try {
      await postAxiosCall(endpoints.cart.add, { medicineid, quantity }, true);
      toast.success("Item added to cart!");
      getAllCartData();
    } catch (error) {
      const errMsg = error?.response?.data?.error;
      const available = error?.response?.data?.available;

      if (errMsg === "Insufficient stock") {
        if (available === 0) {
          toast.error("This item is out of stock.");
        } else {
          toast.error(`Only ${available} item(s) available in stock.`);
        }
      } else {
        toast.error(errMsg || "Failed to add item to cart");
      }

      // console.error("Add to cart failed:", error?.response?.data);
    }
  };

  const getAllCartData = async () => {
    // if (!token) return;
    setGetCartData({ data: [], loading: true });
    try {
      const res = await getAxiosCall(endpoints.cart.get, {}, true);
      setGetCartData({ data: res.data || [], loading: false });
      setCartItems(res.data || []);
      doCheckout();
    } catch (error) {
      console.log("Fetch Cart Error:", error.message);
      setCartItems([]);
      setGetCartData({ data: [], loading: false });
    }
  };

  const removeFromCart = async (id, options = { addDelivery: true }) => {
    try {
      await deleteAxiosCall(endpoints.cart.remove(id), true);
      toast.success("Item removed from cart!");
      await getAllCartData();
      await doCheckout();

      const pathname =
        typeof window !== "undefined" ? window.location.pathname : "";

      if (options.addDelivery && !pathname.includes("/Address")) {
        await addDeliveryData();
      }
    } catch (error) {
      console.error("Remove item error", error);
      toast.error("Failed to remove item");
    }
  };

  const increaseQuantity = (medicineid) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.medicineid === medicineid);
      if (!exists) return [...prev, { medicineid, quantity: 2 }];
      return prev.map((item) =>
        item.medicineid === medicineid
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
  };

  const decreaseQuantity = (medicineid) => {
    setCartItems((prev) => {
      return prev.map((item) =>
        item.medicineid === medicineid && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const getQuantity = (medicineid) => {
    const item = cartItems.find((item) => item.medicineid === medicineid);
    return item ? item.quantity : 1;
  };

  const cartLength = getCartData?.data?.length || 0;

  const clearCart = () => {
    setCartItems([]);
    setGetCartData({ data: [], loading: false });
  };

  const setQuantityInCart = (medicineid, quantity) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.medicineid === medicineid);
      if (exists) {
        return prev.map((item) =>
          item.medicineid === medicineid ? { ...item, quantity } : item
        );
      } else {
        return [...prev, { medicineid, quantity }];
      }
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        clearCart,
        getQuantity,
        increaseQuantity,
        decreaseQuantity,
        getCartData,
        removeFromCart,
        cartLength,
        getAllCartData,

        setQuantityInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
