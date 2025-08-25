"use client";

import React, { createContext, useContext, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "./AuthContext";
import endpoints from "../config/endpoints";
import { getAxiosCall, updateAxiosCall } from "../lib/axios";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { user, fetchUser } = useAuth();
  const [prescriptionHistory, setPrescriptionHistory] = useState({});
  const [allOrder, setAllOrder] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const updateProfile = async (data) => {
    if (!user?.id) return;
    if (
      !data.name?.trim() ||
      !data.phone?.trim() ||
      !data.dob?.trim() ||
      !data.gender?.trim()
    ) {
      Swal.fire({
        title: "Error",
        text: "Please fill all fields before saving.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const payload = {
        full_name: data.name.trim(),
        dob: data.dob,
        gender: data.gender,
        phone: data.phone.trim(),
      };

      await updateAxiosCall(endpoints.account.edit(), user.id, payload, true);

      Swal.fire({
        title: "Success",
        text: "Profile updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      });

      if (fetchUser) await fetchUser();
    } catch (error) {
      console.error("Profile update failed:", error);
      Swal.fire({
        title: "Error",
        text: "Profile update failed. Try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const getAllPrescriptionHistory = async () => {
    try {
      const res = await getAxiosCall(
        endpoints.account.prescriptionhistory,
        {},
        true
      );
      if (res?.status === 200) {
        setPrescriptionHistory(res.data || {});
      }
    } catch (error) {
      console.error("Error fetching prescription history:", error);
      setPrescriptionHistory({});
    }
  };

  const getAllOrder = async () => {
    try {
      const res = await getAxiosCall(endpoints.account.order, {}, true);
      if (res?.status === 200) {
        setAllOrder(res?.data?.orders || {});
      }
    } catch (error) {
      console.error("Error fetching AllOrder history:", error);
      setAllOrder([]);
    }
  };

  const getOrderDetails = async (order_number) => {
    if (!order_number) return;
    try {
      const endpoint = endpoints.account.orderdetails(order_number);
      const res = await getAxiosCall(endpoint, {}, true);

      if (res?.status === 200) {
        setSelectedOrder(res.data || null);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setSelectedOrder(null);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        updateProfile,
        getAllPrescriptionHistory,
        prescriptionHistory,
        getAllOrder,
        allOrder,
        getOrderDetails,
        selectedOrder,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
