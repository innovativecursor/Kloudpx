"use client";

import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";

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
        `http://localhost:10003/v1/user/get-medicines`
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
    <ProductContext.Provider value={{
        allMedicine,

    }}>{children}</ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
