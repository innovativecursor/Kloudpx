"use client";

import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import endpoints from "../config/endpoints";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [allMedicine, setAllMedicine] = useState({
    data: [],
    loading: false,
  });

  const [category, setCategory] = useState({
    data: [],
    loading: false,
  });

  const [filteredItems, setFilteredItems] = useState({
    data: [],
    loading: false,
  });

  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const getAllMedicine = async () => {
    setAllMedicine({ data: [], loading: true });
    try {
      const { data, status } = await axios.get(endpoints.medicine.get);
      if (status === 200) {
        setAllMedicine({ data: data.medicines || [], loading: false });
      }
    } catch (error) {
      console.error(error.message);
      setAllMedicine((prev) => ({ ...prev, loading: false }));
    }
  };

  //   all category ...
  const getCategory = async () => {
    setCategory({ data: [], loading: true });
    try {
      const { data, status } = await axios.get(
        `http://localhost:10003/v1/user/get-categories-for-user`
      );
      if (status === 200) {
        setCategory({ data: data.categories || [], loading: false });
      }
    } catch (error) {
      console.log(error.message);
      setCategory((prev) => ({ ...prev, loading: false }));
    }
  };

  // filtered category ...
  const getItemsByCategory = async (id) => {
    setFilteredItems({ data: [], loading: true });
    try {
      const { data, status } = await axios.get(
        `http://localhost:10003/v1/user/get-items-by-categories/${id}`
      );
      if (status === 200) {
        setFilteredItems({ data: data || [], loading: false });
        const matched = category.data.find((cat) => cat.ID === Number(id));
        setSelectedCategoryName(matched?.CategoryName || "Unknow Category");
      }
    } catch (error) {
      console.error(error.message);
      setFilteredItems((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    getAllMedicine();
    getCategory();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        allMedicine,
        category,
        filteredItems,
        getItemsByCategory,
        selectedCategoryName,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
