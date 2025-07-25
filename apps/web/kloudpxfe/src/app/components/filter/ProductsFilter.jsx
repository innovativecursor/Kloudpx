"use client";

import React, { useEffect, useState } from "react";
import { Range } from "react-range";
import { CiFilter } from "react-icons/ci";
import { useProductContext } from "@/app/contexts/ProductContext";
import useCategoryHandler from "@/app/hooks/useCategoryHandler";
import useProductNavigation from "@/app/hooks/useProductNavigation";

const ProductsFilter = ({ setSelectedCategoryItems }) => {
  const {
    category,
    selectedCategoryId,
    setSelectedCategoryId,
    getFilteredItems,
    priceRange,
    setPriceRange,
    discountRange,
    setDiscountRange,
    getAllBrand,
    branded,
  } = useProductContext();
  const { handleCategoryClick } = useCategoryHandler();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { goToProductPage } = useProductNavigation();
  const handleSingleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
    handleCategoryClick(categoryId);
    setIsMobileOpen(false);
  };

  useEffect(() => {
    if (!selectedCategoryId) return;

    const [minPrice, maxPrice] = priceRange;
    const [minDiscount, maxDiscount] = discountRange;

    getFilteredItems(
      selectedCategoryId,
      minPrice,
      maxPrice,
      minDiscount,
      maxDiscount
    );
  }, [selectedCategoryId, priceRange, discountRange]);

  useEffect(() => {
    if (!branded || branded.length === 0) {
      getAllBrand();
    }
  }, []);

  console.log(branded, "my data");

  const FilterContent = () => (
    <div className="bg-gray-100 h-full overflow-y-auto p-5">
      <span className="font-medium text-lg tracking-wide dark-text">
        Category
      </span>

      {category?.map((item) => (
        <div
          key={item.ID}
          className={`flex items-center gap-2 mt-3 cursor-pointer rounded px-2 py-1
      ${
        selectedCategoryId === item.ID
          ? "bg-[#0070ba]/10 text-[#0070ba]"
          : "hover:text-[#0070ba]"
      }`}
        >
          <input
            type="checkbox"
            checked={selectedCategoryId === item.ID}
            onChange={() => handleSingleCategoryChange(item.ID)}
            className="w-4 h-4 bg-transparent accent-[#0070ba] cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="text-sm tracking-wider">
            {(item?.CategoryName?.slice(0, 15) || "No CategoryName") +
              (item?.CategoryName?.length > 20 ? "... " : "")}
          </span>
        </div>
      ))}

      {/* Brands */}
      <div className="mt-8">
        <span className="font-medium text-lg tracking-wide dark-text">
          Brands
        </span>
        {branded.map(({ brandname, id, genericname }) => (
          <div key={id} className="flex items-center gap-2 mt-3">
            <input
              type="checkbox"
              className="w-4 h-4 bg-transparent accent-[#0070ba] cursor-pointer"
              onClick={() => goToProductPage(id, genericname)}
            />
            <span className="text-sm cursor-pointer tracking-wider">
              {brandname}
            </span>
          </div>
        ))}
      </div>

      {/* Price Range */}
      <div className="mt-10">
        <div className="flex justify-between items-center cursor-pointer mb-2">
          <span className="font-medium text-lg tracking-wide dark-text">
            Price
          </span>
          <i className="ri-arrow-drop-up-line text-xl"></i>
        </div>

        <Range
          step={50}
          min={0}
          max={1000}
          values={priceRange}
          onChange={(values) => setPriceRange(values)}
          onFinalChange={(values) => {
            setPriceRange(values);

            if (!selectedCategoryId) return;

            const [minPrice, maxPrice] = values;
            const [minDiscount, maxDiscount] = discountRange;

            getFilteredItems(
              selectedCategoryId,
              minPrice,
              maxPrice,
              minDiscount,
              maxDiscount
            );

            setIsMobileOpen(false);
          }}
          renderTrack={({ props, children }) => {
            const { key, ...rest } = props;
            return (
              <div
                key={key}
                {...rest}
                className="h-1.5 bg-gray-200 rounded relative w-full"
              >
                <div
                  className="absolute h-1.5 bg-[#0070ba] rounded"
                  style={{
                    left: `${(priceRange[0] / 1000) * 100}%`,
                    width: `${((priceRange[1] - priceRange[0]) / 1000) * 100}%`,
                  }}
                />
                {children}
              </div>
            );
          }}
          renderThumb={({ props }) => {
            const { key, ...restProps } = props;
            return (
              <div
                key={key}
                {...restProps}
                className="h-4 w-4 bg-[#0070ba] rounded-full cursor-pointer"
              />
            );
          }}
        />

        <div className="flex justify-between text-sm mt-2">
          <span>
            ₱{priceRange[0] !== null ? priceRange[0].toFixed(2) : "0.00"}
          </span>
          <span>
            ₱{priceRange[1] !== null ? priceRange[1].toFixed(2) : "0.00"}
          </span>
        </div>
      </div>

      {/* Discount */}
      <div className="mt-12 mb-20">
        <div className="flex justify-between items-center cursor-pointer mb-2">
          <span className="font-medium text-lg tracking-wide dark-text">
            Discount
          </span>
          <i className="ri-arrow-drop-up-line text-xl"></i>
        </div>

        <Range
          step={1}
          min={0}
          max={100}
          values={discountRange}
          onChange={(values) => setDiscountRange(values)}
          onFinalChange={(values) => {
            setDiscountRange(values);

            if (!selectedCategoryId) return;

            const [minPrice, maxPrice] = priceRange;
            const [minDiscount, maxDiscount] = values;

            getFilteredItems(
              selectedCategoryId,
              minPrice,
              maxPrice,
              minDiscount,
              maxDiscount
            );

            setIsMobileOpen(false);
          }}
          renderTrack={({ props, children }) => {
            const { key, ...rest } = props;
            return (
              <div
                key={key}
                {...rest}
                className="h-1.5 bg-gray-200 rounded relative w-full"
              >
                <div
                  className="absolute h-1.5 bg-[#0070ba] rounded"
                  style={{
                    left: `${(discountRange[0] / 100) * 100}%`,
                    width: `${
                      ((discountRange[1] - discountRange[0]) / 100) * 100
                    }%`,
                  }}
                />
                {children}
              </div>
            );
          }}
          renderThumb={({ props }) => {
            const { key, ...restProps } = props;
            return (
              <div
                key={key}
                {...restProps}
                className="h-4 w-4 bg-[#0070ba] rounded-full cursor-pointer"
              />
            );
          }}
        />

        <div className="flex justify-between text-sm mt-2">
          <span>{discountRange[0]}%</span>
          <span>{discountRange[1]}%</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="w-full lg:w-[20%] md:w-[30%] hidden md:block mt-4 rounded-lg sticky top-20 max-h-fit overflow-auto">
        <div className="bg-gray-100">
          <div className="flex justify-between items-center py-4 px-5 bg-[#0070ba] text-white rounded-tl-xl rounded-tr-xl font-medium text-xl">
            <span>Filter</span>
            <i className="ri-sound-module-line"></i>
          </div>
          {FilterContent()}
        </div>
      </div>

      <div
        className="fixed bottom-0 right-0 border-l border-l-gray-200 w-1/2 bg-white text-sm dark-text border-t border-gray-300 shadow-md text-center py-3 md:hidden cursor-pointer z-30 font-medium"
        onClick={() => setIsMobileOpen(true)}
      >
        <div className="flex justify-center items-center">
          <CiFilter /> FILTER
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 md:hidden">
          <div className="absolute left-0 right-0 bg-white rounded-t-xl h-full overflow-y-auto">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <span className="font-semibold text-lg">Filters</span>
              <button onClick={() => setIsMobileOpen(false)}>
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            {FilterContent()}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsFilter;
