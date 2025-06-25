import React, { useState, useRef } from "react";
import Tabs from "../Tabs/Tabs";
import Title from "../Titles/Title";
import ProductsCard from "@/app/components/cards/ProductsCard";

const productsData = [
  {
    id: 1,
    title: "Complete Health Kit",
    subtitle: "Immunity Boost Collection",
    description: "Fast and effective relief",
    image: "/assets/product1.png",
    likes: 32,
  },
  {
    id: 2,
    title: "Ayurvedic Cough Syrup",
    subtitle: "Respiratory Care",
    description: "Soothes sore throat quickly",
    image: "/assets/product2.png",
    likes: 15,
  },
  {
    id: 3,
    title: "Joint Pain Relief Oil",
    subtitle: "Pain Relief Essentials",
    description: "Effective for muscle & joint pain",
    image: "/assets/product3.png",
    likes: 21,
  },
  {
    id: 4,
    title: "Diabetes Care Combo",
    subtitle: "Sugar Control",
    description: "Helps manage blood sugar ",
    image: "/assets/product4.png",
    likes: 18,
  },
  {
    id: 5,
    title: "Joint Pain Relief Oil",
    subtitle: "Pain Relief Essentials",
    description: "Effective for muscle & joint pain",
    image: "/assets/product5.png",
    likes: 21,
  },
  {
    id: 6,
    title: "Diabetes Care Combo",
    subtitle: "Sugar Control",
    description: "Helps manage blood sugar ",
    image: "/assets/product4.png",
    likes: 18,
  },
];

const items = ["All Recommended", "Medicine", "Baby", "Herbs"];

const AllProducts = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef(null);

  const handleClick = (index) => {
    setActiveIndex(index);

    const list = listRef.current;
    if (list) {
      if (index > activeIndex) {
        list.scrollBy({
          left: 80,
          behavior: "smooth",
        });
      } else {
        list.scrollBy({
          left: -100,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <>
      <Title text="Recommended Medicines" />
      <ProductsCard productsData={productsData} />

      <Title text="Shop All" />
      <div className="mt-9" ref={listRef}>
        <Tabs
          items={items}
          activeIndex={activeIndex}
          onTabClick={handleClick}
        />
      </div>
      {activeIndex === 0 && <ProductsCard productsData={productsData} />}
      {activeIndex === 1 && <ProductsCard productsData={productsData} />}
      {activeIndex === 2 && <ProductsCard productsData={productsData} />}
      {activeIndex === 3 && <ProductsCard productsData={productsData} />}
    </>
  );
};

export default AllProducts;
