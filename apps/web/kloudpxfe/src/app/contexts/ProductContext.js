"use client";

import { createContext, useContext, useState, useEffect } from "react";
import endpoints from "../config/endpoints";
import { getAxiosCall } from "@/app/lib/axios";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [allMedicine, setAllMedicine] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategoryItems, setSelectedCategoryItems] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [branded, setBranded] = useState([]);
  const [twoCategory, setTwoCategory] = useState([]);
  const [productDetails, setProductDetails] = useState([]);

  const getAllMedicine = async () => {
    try {
      const res = await getAxiosCall(endpoints.medicine.get, {}, false);
      setAllMedicine(res?.data?.medicines || []);
    } catch (error) {
      setAllMedicine([]);
    }
  };

  const getBranded = async () => {
    try {
      const res = await getAxiosCall(endpoints.branded.get, {}, false);
      setBranded(res?.data?.medicines || []);
    } catch (error) {
      setBranded([]);
    }
  };

  const getCategory = async () => {
    try {
      const res = await getAxiosCall(endpoints.category.getAll, {}, false);
      setCategory(res?.data?.categories || []);
    } catch (error) {
      setCategory([]);
    }
  };

  const getItemsByCategory = async (id) => {
    if (id === selectedCategoryId && selectedCategoryItems.length > 0) return;

    try {
      const res = await getAxiosCall(
        endpoints.category.getItemsByCategory(id),
        {},
        false
      );
      setSelectedCategoryItems(res?.data?.medicines || []);
    } catch (error) {
      console.error("Failed to fetch items by category", error);
      setSelectedCategoryItems([]);
    }
  };

  const getProductDeatils = async (id) => {
    try {
      const res = await getAxiosCall(endpoints.details.get(id), {}, false);
      setProductDetails(res?.data?.medicine || []);
    } catch (error) {
      console.error("Failed to fetch items by category", error);
      setProductDetails([]);
    }
  };

  const getTwoCategory = async () => {
    try {
      const res = await getAxiosCall(endpoints.twocategory.get, {}, false);
      setTwoCategory(res?.data?.categories || []);
    } catch (error) {
      setTwoCategory([]);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        allMedicine,
        category,
        getItemsByCategory,
        getAllMedicine,
        getCategory,
        selectedCategoryItems,
        selectedCategoryId,
        setSelectedCategoryId,
        selectedCategoryName,
        setSelectedCategoryName,
        getBranded,
        branded,
        getTwoCategory,
        twoCategory,
        getProductDeatils,
        productDetails,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
