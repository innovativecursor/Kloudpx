"use client";

import React, { useEffect, useState } from "react";
import { Range } from "react-range";
import { CiFilter } from "react-icons/ci";
import { useProductContext } from "@/app/contexts/ProductContext";
import { useRouter, useSearchParams } from "next/navigation";

const ProductsFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  const {
    category,
    branded,
    selectedCategories,
    handleCategoryChange,
    selectedBrands,
    handleBrandChange,
    priceRange,
    setPriceRange,
    discountRange,
    setDiscountRange,
    getAllBrand,
    isMobileOpen,
    setIsMobileOpen,
    activeSort,
    setActiveSort,
    fetchFilteredMedicines,
  } = useProductContext();

  const visibleBrands = showAll ? branded : branded.slice(0, 20);

  useEffect(() => {
    if (!branded || branded.length === 0) {
      getAllBrand();
    }
  }, []);

  const handleClearAll = async () => {
    setPriceRange([0, 1000]);
    setDiscountRange([0, 100]);

    selectedCategories.forEach((id) => handleCategoryChange(id));
    selectedBrands.forEach((brand) => handleBrandChange(brand));
    setActiveSort("");
    setIsMobileOpen(false);
    fetchFilteredMedicines(null);
    const categoryId = searchParams.get("category");
    const categorySlug = searchParams.get("name");

    let newUrl = "/Products";
    if (categoryId && categorySlug) {
      newUrl += `?category=${categoryId}&name=${categorySlug}`;
    }
    router.push(newUrl);
  };

  const FilterContent = () => (
    <div className="bg-gray-100 h-full overflow-y-auto p-5">
      <div className="flex justify-end ">
        <button
          className="text-sm text-black font-medium cursor-pointer underline"
          onClick={handleClearAll}
        >
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <span className="font-medium text-lg">Category</span>
        {category?.map((item) => (
          <label
            key={item.ID}
            className="flex items-center gap-2 mt-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(item.ID)}
              onChange={() => handleCategoryChange(item.ID)}
              className="w-4 h-4 accent-[#0070ba] cursor-pointer"
            />
            <span className="text-sm">{item.CategoryName}</span>
          </label>
        ))}
      </div>

      {/* Brands Filter */}
      <div className="mt-8">
        <span className="font-medium text-lg">Brands</span>

        {visibleBrands.map((brand, index) => (
          <label
            key={index}
            className="flex items-center gap-2 mt-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={() => handleBrandChange(brand)}
              className="w-4 h-4 accent-[#0070ba] cursor-pointer"
            />
            <span className="text-sm">{brand}</span>
          </label>
        ))}

        {branded.length > 20 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-3 text-sm text-[#0070ba] underline cursor-pointer"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      {/* Price Filter */}
      <div className="mt-10">
        <div className="flex justify-between">
          <span className="font-medium text-lg">Price</span>
        </div>
        <Range
          step={50}
          min={0}
          max={1000}
          values={priceRange}
          onChange={setPriceRange}
          renderTrack={({ props, children }) => (
            <div
              {...props}
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
          )}
          renderThumb={({ props, index }) => {
            const { key, ...restProps } = props;
            return (
              <div
                key={index}
                {...restProps}
                className="h-4 w-4 bg-[#0070ba] rounded-full cursor-pointer"
              />
            );
          }}
        />
        <div className="flex justify-between text-sm mt-2">
          <span>₱{priceRange[0]}</span>
          <span>₱{priceRange[1]}</span>
        </div>
      </div>

      {/* Discount Filter */}
      <div className="mt-10 mb-20">
        <div className="flex justify-between">
          <span className="font-medium text-lg">Discount</span>
        </div>
        <Range
          step={1}
          min={0}
          max={100}
          values={discountRange}
          onChange={setDiscountRange}
          renderTrack={({ props, children }) => (
            <div
              {...props}
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
          )}
          renderThumb={({ props, index }) => {
            const { key, ...restProps } = props;
            return (
              <div
                key={index}
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
      {/* Desktop Sidebar */}
      <div className="w-full lg:w-[20%] md:w-[30%] hidden md:block mt-4 rounded-lg sticky top-20 overflow-auto">
        <div className="bg-gray-100 rounded-xl">
          <div className="flex justify-between items-center py-4 px-5 bg-[#0070ba] text-white rounded-t-xl font-medium text-xl">
            <span>Filter</span>
          </div>
          {FilterContent()}
        </div>
      </div>

      {/* Mobile Drawer Trigger */}
      <div
        className="fixed bottom-0 right-0 w-1/2 bg-white border-t border-gray-300 border-l px-4 py-3 text-center md:hidden z-30 cursor-pointer shadow-sm"
        onClick={() => setIsMobileOpen(true)}
      >
        <div className="flex justify-center items-center gap-1 font-medium text-sm">
          <CiFilter size={18} />
          FILTER
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 md:hidden">
          <div className="absolute left-0 right-0 bg-white h-full rounded-t-xl overflow-y-auto">
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
