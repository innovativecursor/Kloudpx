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
  const [twoCategory, setTwoCategory] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [trending, setTrending] = useState([]);
  const [feature, setFeature] = useState([]);
  const [popular, setPopular] = useState([]);

  const getAllMedicine = async () => {
    try {
      const res = await getAxiosCall(endpoints.medicine.get, {}, false);
      setAllMedicine(res?.data?.medicines || []);
    } catch (error) {
      setAllMedicine([]);
    }
  };

  const getAllFeature = async () => {
    try {
      const res = await getAxiosCall(endpoints.feature.get, {}, false);
      setFeature(res?.data?.medicines || []);
    } catch (error) {
      setFeature([]);
    }
  };

  const getAllPopular = async () => {
    try {
      const res = await getAxiosCall(endpoints.popular.get, {}, false);
      setPopular(res?.data?.medicines || []);
    } catch (error) {
      setPopular([]);
    }
  };

  const getTrendingProducts = async () => {
    try {
      const res = await getAxiosCall(endpoints.trending.get, {}, false);
      setTrending(res?.data?.medicines || []);
    } catch (error) {
      setTrending([]);
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
    if (id === selectedCategoryId && selectedCategoryItems?.length > 0) return;

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
      setProductDetails(res?.data || []);
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

        getTwoCategory,
        twoCategory,
        getProductDeatils,
        productDetails,
        getTrendingProducts,
        trending,
        getAllFeature,
        feature,
        getAllPopular,
        popular

      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
