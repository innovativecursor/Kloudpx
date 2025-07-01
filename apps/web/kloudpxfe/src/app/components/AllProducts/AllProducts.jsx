"use client";
import React, { useState, useRef } from "react";
// import Tabs from "../Tabs/Tabs";
import Title from "../Titles/Title";
import ProductsCard from "@/app/components/cards/ProductsCard";
import { useProductContext } from "@/app/contexts/ProductContext";

// const items = ["All Recommended", "Medicine", "Baby", "Herbs"];

const AllProducts = () => {
  const { filteredItems } = useProductContext();

  // const [activeIndex, setActiveIndex] = useState(0);
  // const listRef = useRef(null);

  // const handleClick = (index) => {
  //   setActiveIndex(index);

  //   const list = listRef.current;
  //   if (list) {
  //     if (index > activeIndex) {
  //       list.scrollBy({
  //         left: 80,
  //         behavior: "smooth",
  //       });
  //     } else {
  //       list.scrollBy({
  //         left: -100,
  //         behavior: "smooth",
  //       });
  //     }
  //   }
  // };

  return (
    <>
      <Title text="Recommended Items" />
      <ProductsCard productsData={filteredItems} />

      {/* <Title text="Shop All" />
      <div className="mt-9" ref={listRef}>
        <Tabs
          items={items}
          activeIndex={activeIndex}
          onTabClick={handleClick}
        />
      </div>
      {activeIndex === 0 && <ProductsCard productsData={filteredItems} />}
      {activeIndex === 1 && <ProductsCard productsData={filteredItems} />}
      {activeIndex === 2 && <ProductsCard productsData={filteredItems} />}
      {activeIndex === 3 && <ProductsCard productsData={filteredItems} />} */}
    </>
  );
};

export default AllProducts;
