"use client";

import { createContext, useContext, useState, useEffect } from "react";
import endpoints from "../config/endpoints";
import { getAxiosCall } from "@/app/lib/axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import axios from "axios";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const router = useRouter();
  const [allMedicine, setAllMedicine] = useState([]);
  const [activeSort, setActiveSort] = useState("");
  const [category, setCategory] = useState([]);
  const [selectedCategoryItems, setSelectedCategoryItems] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [twoCategory, setTwoCategory] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [trending, setTrending] = useState([]);
  const [feature, setFeature] = useState([]);
  const [popular, setPopular] = useState([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [branded, setBranded] = useState([]);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [discountRange, setDiscountRange] = useState([0, 100]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
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
      // console.log(res, "");
      
      setBranded(res?.data?.brand_names || []);
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

  const fetchFilteredMedicines = async (sort = activeSort) => {
    const isFilterActive =
      selectedCategories.length > 0 ||
      selectedBrands.length > 0 ||
      priceRange[0] > 0 ||
      priceRange[1] < 1000 ||
      discountRange[0] > 0 ||
      discountRange[1] < 100;

    if (!isFilterActive && !sort) {
      setFilteredMedicines([]);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();

      selectedCategories.forEach((catId) => {
        params.append("category_ids", catId.toString());
      });

      selectedBrands.forEach((brand) => {
        params.append("brands", brand);
      });

      if (priceRange[0] > 0) params.append("min_price", priceRange[0]);
      if (priceRange[1] < 1000) params.append("max_price", priceRange[1]);

      if (discountRange[0] > 0) params.append("min_discount", discountRange[0]);
      if (discountRange[1] < 100)
        params.append("max_discount", discountRange[1]);

      if (sort) params.append("sort", sort);

      router.push(`/Products?${params.toString()}`);
      setIsMobileOpen(false);

      const res = await getAxiosCall(endpoints.filters.get, params, false);
      setFilteredMedicines(res?.data?.medicines || []);
    } catch (err) {
      console.error("Failed to fetch filtered medicines", err);
      setFilteredMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const categoryId = searchParams.get("category");
    const categorySlug = searchParams.get("name");

    if (categoryId) {
      setSelectedCategoryId(Number(categoryId));
      if (categorySlug) {
        const name = categorySlug.replace(/-/g, " ");
        setSelectedCategoryName(name);
      }
      getItemsByCategory(Number(categoryId));
    }
  }, []);

  useEffect(() => {
    fetchFilteredMedicines();
  }, [selectedCategories, selectedBrands, priceRange, discountRange]);

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

        setSelectedCategoryItems,
        priceRange,
        setPriceRange,
        discountRange,
        setDiscountRange,
        getAllBrand,
        branded,

        selectedCategories,
        handleCategoryChange,
        selectedBrands,
        handleBrandChange,
        priceRange,
        setPriceRange,
        discountRange,
        setDiscountRange,
        filteredMedicines,
        loading,
        getAllBrand,
        setSelectedCategories,
        isMobileOpen,
        setIsMobileOpen,
        fetchFilteredMedicines,
        activeSort,
        setActiveSort,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
