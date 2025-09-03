"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import endpoints from "../config/endpoints";
import { postAxiosCall, getAxiosCall } from "../lib/axios";
import { usePathname } from "next/navigation";
import { useCartContext } from "./CartContext";
import toast from "react-hot-toast";

const DoctorClinicsContext = createContext();

export const DoctorClinicsProvider = ({ children }) => {
  const pathname = usePathname();
  const [allClinics, setAllClinics] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [selectedClinicId, setSelectedClinicId] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const { cartItems } = useCartContext();

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
    <DoctorClinicsContext.Provider
      value={{
        allDoctors,
        allClinics,
        getAllClinics,
        getAllDoctors,
        selectedClinicId,
        setSelectedClinicId,
        selectedDoctorId,
        setSelectedDoctorId,
      }}
    >
      {children}
    </DoctorClinicsContext.Provider>
  );
};

export const useDoctorClinicsContext = () => useContext(DoctorClinicsContext);
