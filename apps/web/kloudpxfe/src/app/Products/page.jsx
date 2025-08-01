"use client";

import React, { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useProductContext } from "../contexts/ProductContext";
import ProductsFilter from "../components/filter/ProductsFilter";
import AllProducts from "../components/AllProducts/AllProducts";
// import Hero from "../components/Hero/Hero";
import Sorting from "../components/sorting/Sorting";

const Page = () => {
  const searchParams = useSearchParams();
  const categoryIdFromUrl = searchParams.get("category");

  // const scrollRef = useRef(null);

  const {
    selectedCategoryItems,
    selectedCategoryId,
    setSelectedCategoryId,
    setSelectedCategoryName,
    category,
    setSelectedCategoryItems,
    getItemsByCategory,
    filteredMedicines,
    selectedCategories,
    selectedBrands,
    priceRange,
    discountRange,
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

    // setTimeout(() => {
    //   if (scrollRef.current) {
    //     scrollRef.current.scrollIntoView({ behavior: "smooth" });
    //   }
    // }, 300);
  }, [categoryIdFromUrl, category]);

  return (
    <div className="md:mt-56 sm:mt-40 mt-32">
      {/* <div className="mt-40 md:mt-64 sm:mt-48">
        <Hero />
      </div> */}
      <div
      // ref={scrollRef} className="scroll-mt-[6rem] sm:scroll-mt-[11rem]"
      />

      <div className="responsive-mx pt-5 md:pt-7">
        <div className="flex justify-between items-start md:mt-5 mt-4 dark-text font-medium">
          <div className="flex gap-1 lg:text-base md:text-sm">
            <span className="opacity-70">
              Viewing{" "}
              {
                (filteredMedicines.length > 0
                  ? filteredMedicines
                  : selectedCategories.length > 0 ||
                    selectedBrands.length > 0 ||
                    priceRange[0] > 0 ||
                    priceRange[1] < 1000 ||
                    discountRange[0] > 0 ||
                    discountRange[1] < 100
                  ? []
                  : selectedCategoryItems
                )?.length
              }{" "}
              results of
            </span>

            <span className="dark-text">"Medicine"</span>
          </div>

          <div>
            <Sorting />
          </div>
        </div>

        <section className="flex mt-7">
          <ProductsFilter />
          <div className="flex-1 md:ml-9">
            <AllProducts
              selectedCategoryItems={
                filteredMedicines.length > 0
                  ? filteredMedicines
                  : filteredMedicines.length === 0 &&
                    (selectedCategories.length > 0 ||
                      selectedBrands.length > 0 ||
                      priceRange[0] > 0 ||
                      priceRange[1] < 1000 ||
                      discountRange[0] > 0 ||
                      discountRange[1] < 100)
                  ? []
                  : selectedCategoryItems
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
