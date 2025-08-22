"use client";
import React, { useEffect, useState } from "react";
import ProductsCard from "@/app/components/cards/ProductsCard";
import FeaturedBrand from "../featuredbrand/FeaturedBrand";
// import sale1 from "@/assets/1.svg";
// import sale2 from "@/assets/2.svg";
import Pagination from "../Pagination/Pagination";
import { useProductContext } from "@/app/contexts/ProductContext";
import { FiAlertCircle } from "react-icons/fi";

const AllProducts = ({ selectedCategoryItems = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { getAllFeature, feature } = useProductContext();
  const first8 = selectedCategoryItems.slice(0, 8);
  const next4 = selectedCategoryItems.slice(8, 12);
  const afterImage4 = selectedCategoryItems.slice(12, 16);
  const remaining = selectedCategoryItems.slice(16);

  const totalPages = remaining?.length > 0 ? 2 : 1;

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  useEffect(() => {
    getAllFeature();
  }, []);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {currentPage === 1 && (
        <>
          {first8.length === 0 ? (
            <div className="flex flex-col justify-center items-center w-full h-96  text-red-600">
              <FiAlertCircle className="sm:text-4xl text-2xl mb-2" />
              <p className="sm:text-base text-xs font-semibold">
                No products found
              </p>
            </div>
          ) : (
            <ProductsCard selectedCategoryItems={first8} />
          )}

          {first8.length !== 0 && (
            <>
              {Array.isArray(feature) && feature.length > 0 && (
                <div className="bg-white flex justify-center">
                  <div className="mt-5 sm:mt-10 md:mt-12 bg-gray-200/70 rounded-xl sm:py-9 py-8 md:w-[63vw] w-[94vw] sm:px-6 px-4 overflow-hidden mb-10 sm:mb-20">
                    <FeaturedBrand feature={feature} />
                  </div>
                </div>
              )}
            </>
          )}

          <ProductsCard selectedCategoryItems={next4} />

          <ProductsCard selectedCategoryItems={afterImage4} />
        </>
      )}
      {currentPage === 2 && <ProductsCard selectedCategoryItems={remaining} />}

      {/* Pagination Controls */}

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePrev={handlePrev}
        handleNext={handleNext}
        handlePageClick={handlePageClick}
      />
    </>
  );
};

export default AllProducts;
