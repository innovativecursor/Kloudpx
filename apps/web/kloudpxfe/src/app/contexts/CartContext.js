"use client";

import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";
import endpoints from "../config/endpoints";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [getCartData, setGetCartData] = useState({ data: [], loading: false });
  const [prescriptionCheckedItems, setPrescriptionCheckedItems] =
    React.useState(new Set());

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // const addToCart = async (
  //   medicineid,
  //   quantity,
  //   prescriptionRequired = false,
  //   uploadedImage = null
  // ) => {
  //   if (!token) {
  //     toast.error("Please login first");
  //     return null;
  //   }

  //   if (prescriptionRequired && !uploadedImage) {
  //     toast.error("Please upload the prescription, pharmacist will check");
  //     return;
  //   }

  //   if (prescriptionRequired && uploadedImage) {
  //     toast.success(
  //       "Pharmacist will check your prescription and then add to cart"
  //     );
  //   }

  //   try {
  //     const addedItem = { medicineid, quantity };

  //     const response = await axios.post(
  //       `http://localhost:10003/v1/user/add-to-cart`,
  //       { medicineid, quantity },
  //       {
  //         headers: {
  //           Authorization: `${token}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200 || response.status === 201) {
  //       setCartItems((prevItems) => {
  //         const existingItem = prevItems.find(
  //           (item) => item.medicineid === medicineid
  //         );
  //         if (existingItem) {
  //           return prevItems.map((item) =>
  //             item.medicineid === medicineid
  //               ? { ...item, quantity: item.quantity + quantity }
  //               : item
  //           );
  //         } else {
  //           return [...prevItems, addedItem];
  //         }
  //       });

  //       toast.success("Item added to cart!");
  //       getAllCartData();
  //     }
  //   } catch (error) {
  //     console.error("Add to Cart failed:", error);
  //     toast.error("Failed to add to cart");
  //     throw error;
  //   }
  // };

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

    try {
      const response = await axios.post(
        `http://localhost:10003/v1/user/add-to-cart`,
        { medicineid, quantity },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
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

        if (prescriptionRequired) {
          toast.success(
            "Item added to cart! Pharmacist will check your prescription."
          );
          setPrescriptionCheckedItems((prev) => new Set(prev).add(medicineid));
        } else {
          toast.success("Item added to cart!");
        }
        getAllCartData();
      }
    } catch (error) {
      if (error.response?.status === 400 && prescriptionRequired) {
        toast.success(
          "Item already added! Pharmacist is still checking your prescription."
        );
        return;
      }
      console.error("Add to Cart failed:", error);
      toast.error("Failed to add to cart");
      throw error;
    }
  };

  const isInCart = (medicineid) => {
    return cartItems.some((item) => item.medicineid === medicineid);
  };

  const getAllCartData = async () => {
    if (!token) {
      setGetCartData("Token missing, please login again.");
      return null;
    }
    setGetCartData({ data: [], loading: true });
    try {
      const { data, status } = await axios.get(
        `http://localhost:10003/v1/user/get-cart`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (status === 200) {
        setGetCartData({ data: data || [], loading: false });
      }
    } catch (error) {
      console.log(error.message);
      setCartItems((prev) => ({ ...prev, loading: false }));
    }
  };

  const removeFromCart = async (id) => {
    if (!token) {
      toast.error("please login...");
      return;
    }
    try {
      const res = await axios.delete(
        `http://localhost:10003/v1/user/remove-item-cart/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (res.status === 200) {
        toast.success("item removed form cart!");
        getAllCartData();
      }
    } catch (error) {
      console.error("Failed to remove item from cart", error);
      toast.error("Failed to remove item");
    }
  };

  const cartLength = getCartData?.data?.length || 0;

  useEffect(() => {
    getAllCartData();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        isInCart,
        quantity,
        increase,
        decrease,
        getCartData,
        removeFromCart,
        cartLength,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
