"use client";

import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import endpoints from "../config/endpoints";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [allMedicine, setAllMedicine] = useState({
    data: [],
    loading: true,
  });

  const getAllMedicine = async () => {
    setAllMedicine({ data: [], loading: true });
    try {
      const { data, status } = await axios.get(
        endpoints.medicine.get
      );
      if (status === 200) {
        setAllMedicine({ data: data.medicines || [], loading: false });
      }
    } catch (error) {
      console.error(error.message);
      setAllMedicine((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    getAllMedicine();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        allMedicine,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
