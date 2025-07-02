"use client";

import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import endpoints from "../config/endpoints";
import { useLoading } from "./LoadingContext";
import DashboardLoading from "../components/Loader/DashboardLoader";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { loading, setLoading } = useLoading();

  const [allMedicine, setAllMedicine] = useState({ data: [], loading: false });
  const [category, setCategory] = useState({ data: [], loading: false });
  const [filteredItems, setFilteredItems] = useState({
    data: [],
    loading: false,
  });
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const getAllMedicine = async () => {
    setLoading(true);
    try {
      const res = await axios.get(endpoints.medicine.get);
      setAllMedicine({
        data: res?.data?.medicines || [],
        loading: false,
      });
    } catch (error) {
      console.error("Medicine error:", error.message);
      setAllMedicine({ data: [], loading: false });
    } finally {
      setLoading(false);
    }
  };

  const getCategory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(endpoints.category.getAll);
      setCategory({
        data: res?.data?.categories || [],
        loading: false,
      });
    } catch (error) {
      console.error("Category error:", error.message);
      setCategory({ data: [], loading: false });
    } finally {
      setLoading(false);
    }
  };

  const getItemsByCategory = async (id) => {
    setFilteredItems({ data: [], loading: true });
    try {
      const res = await axios.get(endpoints.category.getItemsByCategory(id));
      setFilteredItems({ data: res?.data || [], loading: false });

      const matched = category.data.find((cat) => cat.ID === Number(id));
      setSelectedCategoryName(matched?.CategoryName || "Unknown Category");
    } catch (error) {
      console.error("Filtered error:", error.message);
      setFilteredItems({ data: [], loading: false });
    }
  };

  useEffect(() => {
    if (!allMedicine.data || allMedicine.data.length === 0) {
      getAllMedicine();
    }
  }, []);

  useEffect(() => {
    if (!category.data || category.data.length === 0) {
      getCategory();
    }
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
      {loading ? <DashboardLoading /> : children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
