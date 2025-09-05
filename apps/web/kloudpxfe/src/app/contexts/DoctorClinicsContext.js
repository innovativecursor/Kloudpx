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
  const [isCustomConfirmed, setIsCustomConfirmed] = useState(false);

  const [customHospital, setCustomHospital] = useState("");
  const [customPhysician, setCustomPhysician] = useState("");

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

  const handleCustomConfirm = () => {
    if (customHospital?.trim() && customPhysician?.trim()) {
      setIsCustomConfirmed(true);
    }
  };

  const handleSendClinicsDoctors = async (cartItems) => {
    if (!cartItems?.length) return;

    const cart_ids = cartItems.map((item) => item.cart_id);
    let payload = { cart_ids };

    if (selectedClinicId && selectedDoctorId) {
      payload.hospital_id = selectedClinicId;
      payload.physician_id = selectedDoctorId;
    } else if (isCustomConfirmed && customHospital && customPhysician) {
      payload.custom_hospital = customHospital.trim();
      payload.custom_physician = customPhysician.trim();
    } else {
      return;
    }

    try {
      const res = await postAxiosCall(
        endpoints.sendclinicsdoctors.add,
        payload,
        true
      );
      if (res?.message) toast.success(res.message);
    } catch (error) {
      console.log("Error calling select-doctor-or-clinic API", error);
    }
  };
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
        customHospital,
        setCustomHospital,
        customPhysician,
        setCustomPhysician,
        isCustomConfirmed,
        setIsCustomConfirmed,
        handleCustomConfirm,
        handleSendClinicsDoctors,
      }}
    >
      {children}
    </DoctorClinicsContext.Provider>
  );
};

export const useDoctorClinicsContext = () => useContext(DoctorClinicsContext);
