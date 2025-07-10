"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProductContext } from "../contexts/ProductContext";
import ProductsFilter from "../components/filter/ProductsFilter";
import AllProducts from "../components/AllProducts/AllProducts";
import SubTitle from "../components/Titles/SubTitle";

const Page = () => {
  const searchParams = useSearchParams();
  const categoryIdFromUrl = searchParams.get("category");

  const {
    selectedCategoryItems,
    selectedCategoryName,
    setSelectedCategoryId,
    setSelectedCategoryName,
    category,
    getItemsByCategory,
  } = useProductContext();

  useEffect(() => {
    if (categoryIdFromUrl) {
      const id = parseInt(categoryIdFromUrl, 10);
      setSelectedCategoryId(id);
      if (selectedCategoryItems.length === 0) {
        getItemsByCategory(id);
      }
      const cat = category.find((c) => c.ID === id);
      if (cat) {
        setSelectedCategoryName(cat.CategoryName);
      }
    }
  }, [categoryIdFromUrl, category]);

  return (
    <div className="bg-gray-100">
      <div className="responsive-mx pt-5 md:pt-7">
        <SubTitle paths={["Home", selectedCategoryName || "Category"]} />
        <div className="flex mt-7">
          <ProductsFilter />
          <div className="flex-1 md:ml-9">
            <AllProducts selectedCategoryItems={selectedCategoryItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
