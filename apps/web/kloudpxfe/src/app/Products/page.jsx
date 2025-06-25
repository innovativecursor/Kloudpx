"use client";
import React from "react";
import ProductsFilter from "../components/filter/ProductsFilter";
import AllProducts from "../components/AllProducts/AllProducts";
import SubTitle from "../components/Titles/SubTitle";

const page = () => {
  return (
    <div className="bg-gray-100">
      <div className="responsive-mx pt-5 md:pt-7">
        <SubTitle paths={["Home", "Shoes", "Medicine"]} />
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

export default page;
