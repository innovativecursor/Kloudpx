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
  const { openSignup } = useLoginAuth();
  const [cartItems, setCartItems] = useState([]);
  const [allClinics, setAllClinics] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [getCartData, setGetCartData] = useState({ data: [], loading: false });
  const [selectedClinicId, setSelectedClinicId] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  const addToCart = async (medicineid, quantity) => {
    if (!token) {
      // toast.error("Please login first");
      openSignup();
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
        toast.error(`Only ${available} items available in stock.`);
      } else {
        toast.error(errMsg || "Failed to add item to cart");
      }

      console.error("Add to cart failed:", error?.response?.data);
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

  const getAllClinics = async () => {
    try {
      const res = await getAxiosCall(endpoints.clinics.get, {}, true);
      if (res?.status === 200) {
        setAllClinics(res?.data || []);
      } else {
        setAllClinics([]);
      }
    } catch (error) {
      setAllClinics([]);
    }
  };

  const getAllDoctors = async () => {
    try {
      const res = await getAxiosCall(endpoints.doctors.get, {}, true);
      if (res?.status === 200) {
        setAllDoctors(res?.data || []);
      } else {
        setAllDoctors([]);
      }
    } catch (error) {
      setAllDoctors([]);
    }
  };

  useEffect(() => {
    const callSelectDoctorOrClinic = async () => {
      if (
        pathname === "/Checkout" &&
        cartItems.length > 0 &&
        selectedClinicId !== null &&
        selectedDoctorId !== null
      ) {
        const cart_ids = cartItems.map((item) => item.cart_id);
        const payload = {
          cart_ids,
          hospital_id: selectedClinicId,
          physician_id: selectedDoctorId,
        };

        try {
          const res = await postAxiosCall(
            endpoints.sendclinicsdoctors.add,
            payload,
            true
          );
          // console.log("Selected clinic/doctor API called successfully:", res);
          toast.success(res?.message);
        } catch (error) {
          console.error("Error calling select-doctor-or-clinic API", error);
        }
      }
    };

    callSelectDoctorOrClinic();
  }, [cartItems, selectedClinicId, selectedDoctorId]);

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
        getAllClinics,
        allClinics,
        allDoctors,
        getAllDoctors,
        selectedClinicId,
        setSelectedClinicId,
        selectedDoctorId,
        setSelectedDoctorId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
