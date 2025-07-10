import React from "react";
import Title from "../Titles/Title";
import ProductsCard from "@/app/components/cards/ProductsCard";

const AllProducts = ({ selectedCategoryItems }) => {
  return (
    <>
      <Title text="Recommended Items" />
      <ProductsCard selectedCategoryItems={selectedCategoryItems || []} />
    </>
  );
};

export default AllProducts;
