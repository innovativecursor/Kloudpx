"use client";

import React, { useEffect, Suspense } from "react";
import ProductsFilter from "../components/filter/ProductsFilter";
import AllProducts from "../components/AllProducts/AllProducts";
import SubTitle from "../components/Titles/SubTitle";
import { useSearchParams } from "next/navigation";
import { useProductContext } from "../contexts/ProductContext";

const ProductPageContent = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");

  const { getItemsByCategory, selectedCategoryName } = useProductContext();

  useEffect(() => {
    if (categoryId) {
      getItemsByCategory(categoryId);
    }
  }, [categoryId]);

  return (
    <div className="bg-gray-100">
      <div className="responsive-mx pt-5 md:pt-7">
        <SubTitle paths={["Home", selectedCategoryName || "Category"]} />
        <div className="flex mt-7">
          <ProductsFilter />
          <div className="flex-1 md:ml-9">
            <AllProducts />
          </div>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductPageContent />
    </Suspense>
  );
};

export default Page;
