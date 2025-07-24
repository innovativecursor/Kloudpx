"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProductContext } from "../contexts/ProductContext";
import ProductsFilter from "../components/filter/ProductsFilter";
import AllProducts from "../components/AllProducts/AllProducts";
// import SubTitle from "../components/Titles/SubTitle";
import Hero from "../components/Hero/Hero";
import Sorting from "../components/sorting/Sorting";

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
      if (selectedCategoryItems?.length === 0) {
        getItemsByCategory(id);
      }
      const cat = category.find((c) => c.ID === id);
      if (cat) {
        setSelectedCategoryName(cat.CategoryName);
      }
    }
  }, [categoryIdFromUrl, category]);

  // console.log(selectedCategoryItems.length);

  return (
    <div>
      <Hero />
      <div className="responsive-mx pt-5 md:pt-7">
        {/* <SubTitle paths={["Home", selectedCategoryName || "Category"]} /> */}
        <div className="flex justify-between items-start md:mt-5 mt-4 dark-text font-medium">
          <div className="flex gap-1 lg:text-base md:text-sm">
            <p className="opacity-70">
              Viewing {selectedCategoryItems?.length} results of
            </p>{" "}
            <span className="dark-text">"Medicine"</span>
          </div>

          <div className="">
            <Sorting />
          </div>
        </div>
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
