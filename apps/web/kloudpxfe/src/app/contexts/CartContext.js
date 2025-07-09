"use client";

import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { postAxiosCall, getAxiosCall, deleteAxiosCall } from "@/app/lib/axios";
import endpoints from "../config/endpoints";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [getCartData, setGetCartData] = useState({ data: [], loading: false });
  const [prescriptionCheckedItems, setPrescriptionCheckedItems] = useState(
    new Set()
  );

  const addToCart = async (
    medicineid,
    quantity,
    prescriptionRequired = false,
    uploadedImage = null
  ) => {
    if (!token) {
      toast.error("Please login first");
      return null;
    }

    if (prescriptionRequired && !uploadedImage) {
      toast.error("Please upload the prescription, pharmacist will check");
      return;
    }

    if (prescriptionRequired && prescriptionCheckedItems.has(medicineid)) {
      toast.success(
        "Item already added! Pharmacist is still checking your prescription."
      );
      return;
    }

    const data = { medicineid, quantity };

    try {
      const response = await postAxiosCall(endpoints.cart.add, data, true);

      // ✅ Update cart state
      setCartItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.medicineid === medicineid
        );
        if (existingItem) {
          return prevItems.map((item) =>
            item.medicineid === medicineid
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          return [...prevItems, { medicineid, quantity }];
        }
      });

      // ✅ Handle prescription logic
      if (prescriptionRequired) {
        toast.success(
          "Item added to cart! Pharmacist will check your prescription."
        );
        setPrescriptionCheckedItems((prev) => new Set(prev).add(medicineid));
      } else {
        toast.success("Item added to cart!");
      }

      getAllCartData();
      return { success: true };
    } catch (error) {
      // 🛑 Handle insufficient stock
      if (
        error?.response?.status === 400 &&
        error?.response?.data?.error === "Insufficient stock"
      ) {
        return {
          error: "insufficient_stock",
          available: error.response.data.available || 0,
        };
      }

      // 🛑 Handle duplicate prescription (optional)
      if (
        error?.response?.status === 400 &&
        prescriptionRequired &&
        error?.response?.data?.error?.toLowerCase().includes("prescription")
      ) {
        toast.success(
          "Item already added! Pharmacist is still checking your prescription."
        );
        return;
      }

      toast.error("Failed to add to cart");
      return { error: "unknown" };
    }
  };

  const getAllCartData = async () => {
    if (!token) {
      // setGetCartData("Token missing, please login again.");
      setGetCartData({
        data: [],
        loading: false,
        error: "Token missing, please login again.",
      });

      return null;
    }
    setGetCartData({ data: [], loading: true });
    try {
      const res = await getAxiosCall(endpoints.cart.get, {}, true);
      setGetCartData({ data: res.data || [], loading: false });
      setCartItems(res.data || []);
    } catch (error) {
      console.log("Fetch Cart Error:", error.message);
      setCartItems([]);
      setGetCartData({ data: [], loading: false });
    }
  };

  const removeFromCart = async (id) => {
    if (!token) {
      toast.error("please login...");
      return;
    }

    try {
      await deleteAxiosCall(endpoints.cart.remove, id, true);
      toast.success("Item removed from cart!");
      getAllCartData();
    } catch (error) {
      console.error("Remove item error", error);
      toast.error("Failed to remove item");
    }
  };

  const isInCart = (medicineid) =>
    cartItems.some((item) => item.medicineid === medicineid);

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

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        isInCart,
        getQuantity,
        increaseQuantity,
        decreaseQuantity,
        getCartData,
        removeFromCart,
        cartLength,
        getAllCartData,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
