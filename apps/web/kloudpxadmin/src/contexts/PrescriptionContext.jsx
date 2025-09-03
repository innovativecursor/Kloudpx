"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getAxiosCall, updateAxiosCall } from "../Axios/UniversalAxiosCalls";
import endpoints from "../config/endpoints";
import Swal from "sweetalert2";

export const PrescriptionContext = createContext();

const PrescriptionProvider = ({ children }) => {
  const [allPrescription, setAllPrescription] = useState([]);
  const [singlePrescription, setSinglePrescription] = useState(null);

  const getAllSeniorCitizen = async () => {
    const res = await getAxiosCall(endpoints.prescription.getAll);
    {
      if (res?.data) {
        setAllPrescription(res.data);
      }
    }
  };

  const getSinglePrescriptionData = async (id) => {
    const res = await getAxiosCall(endpoints.prescription.getone(id));
    {
      if (res?.data) {
        setSinglePrescription(res.data);
      }
    }
  };

  return (
    <PrescriptionContext.Provider
      value={{
        getAllSeniorCitizen,
        allPrescription,
        getSinglePrescriptionData,
        singlePrescription,
      }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
};

export default PrescriptionProvider;
export const usePrescriptionContext = () => useContext(PrescriptionContext);
