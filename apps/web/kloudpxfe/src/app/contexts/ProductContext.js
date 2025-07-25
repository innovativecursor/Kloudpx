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
  const [activeSort, setActiveSort] = useState("Popular");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [discountRange, setDiscountRange] = useState([0, 100]);
  const [branded, setBranded] = useState([]);

  const sortParamMap = {
    Popular: "popular",
    Discounts: "discounts",
    "Cost: high to Low": "high-to-low",
    "Cost: Low to High": "low-to-high",
  };

  const getAllMedicine = async () => {
    try {
      const res = await getAxiosCall(endpoints.medicine.get, {}, false);
      setAllMedicine(res?.data?.medicines || []);
    } catch (error) {
      setAllMedicine([]);
    }
  };

  const getAllBrand = async () => {
    try {
      const res = await getAxiosCall(endpoints.branded.get, {}, false);
      setBranded(res?.data?.medicines || []);
    } catch (error) {
      setBranded([]);
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

  const getSortedItemsByCategory = async (categoryId, sortBy) => {
    if (!categoryId) return;

    try {
      const sortParam = sortParamMap[sortBy] || "popular";
      const res = await getAxiosCall(
        endpoints.category.sortBy(categoryId),
        { sort: sortParam },
        false
      );

      setSelectedCategoryItems(res?.data?.medicines || []);
    } catch (error) {
      console.error("Failed to fetch sorted items by category", error);
      setSelectedCategoryItems([]);
    }
  };


  const getFilteredItems = async (
    categoryId,
    minPrice,
    maxPrice,
    minDiscount,
    maxDiscount
  ) => {
    if (!categoryId) return;

    try {
      const params = {};

      if (minPrice !== null && maxPrice !== null) {
        params.min_price = minPrice;
        params.max_price = maxPrice;
      }
      if (minDiscount !== null && maxDiscount !== null) {
        params.min_discount = minDiscount;
        params.max_discount = maxDiscount;
      }

      const res = await getAxiosCall(
        endpoints.category.priceDiscountFilter(categoryId),
        params,
        false
      );

      setSelectedCategoryItems(res?.data?.medicines || []);
    } catch (error) {
      console.error("Failed to fetch filtered items:", error);
      setSelectedCategoryItems([]);
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
        popular,

        getSortedItemsByCategory,
        activeSort,
        setActiveSort,

        setSelectedCategoryItems,
        priceRange,
        setPriceRange,
        discountRange,
        setDiscountRange,
        getAllBrand,
        branded,
        getFilteredItems
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
