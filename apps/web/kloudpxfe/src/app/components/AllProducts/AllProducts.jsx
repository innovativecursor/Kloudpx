import React, { useState } from "react";
import ProductsCard from "@/app/components/cards/ProductsCard";
import FeaturedBrand from "../featuredbrand/FeaturedBrand";
import sale1 from "@/assets/1.svg";
import sale2 from "@/assets/2.svg";
import Pagination from "../Pagination/Pagination";

const AllProducts = ({ selectedCategoryItems = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const first8 = selectedCategoryItems.slice(0, 8);
  const next4 = selectedCategoryItems.slice(8, 12);
  const afterImage4 = selectedCategoryItems.slice(12, 16);
  const remaining = selectedCategoryItems.slice(16);

  const totalPages = remaining.length > 0 ? 2 : 1;

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <>
      {currentPage === 1 && (
        <>
          <ProductsCard selectedCategoryItems={first8} />

          <div className="bg-white flex justify-center">
            <div className="mt-5 sm:mt-10 md:mt-12 bg-gray-200/70 rounded-xl sm:py-9 py-8 md:w-[63vw] w-[94vw] sm:px-6 px-4 overflow-hidden mb-10 sm:mb-20">
              <FeaturedBrand />
            </div>
          </div>
          <ProductsCard selectedCategoryItems={next4} />

          <div className="flex justify-between items-center lg:mt-10 sm:mt-14 sm:gap-4 gap-2 mb-10 sm:mb-20">
            <img
              className="lg:h-[26vw] md:h-[25vw]  h-[37vw] w-auto object-contain"
              src={sale1.src}
              alt="sale1"
            />
            <img
              className="lg:h-[26vw] md:h-[25vw] h-[37vw] w-auto object-contain"
              src={sale2.src}
              alt="sale2"
            />
          </div>

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
      />
    </>
  );
};

export default AllProducts;
