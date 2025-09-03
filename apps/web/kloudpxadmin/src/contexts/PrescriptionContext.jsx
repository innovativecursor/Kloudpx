"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getAxiosCall, updateAxiosCall } from "../Axios/UniversalAxiosCalls";
import endpoints from "../config/endpoints";
import Swal from "sweetalert2";

export const PrescriptionContext = createContext();

const PrescriptionProvider = ({ children }) => {

  return (
    <PrescriptionContext.Provider
      value={{

      }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
};

export default PrescriptionProvider;
export const usePrescriptionContext = () => useContext(PrescriptionContext);
