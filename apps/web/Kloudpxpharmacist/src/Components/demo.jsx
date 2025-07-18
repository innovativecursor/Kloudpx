import React from "react";
import ProductsCard from "@/app/components/cards/ProductsCard";
// import FeaturedBrand from "../featuredbrand/FeaturedBrand";
import sale1 from "@/assets/1.svg";
import sale2 from "@/assets/2.svg";

const AllProducts = ({ selectedCategoryItems }) => {
  return (
    <>
      <ProductsCard selectedCategoryItems={selectedCategoryItems || []} />

      {/* <div className="mt-12 sm:mt-16 md:mt-20 bg-gray-200/70 rounded-xl sm:py-9 py-8 sm:px-6 px-4 overflow-hidden">
        <FeaturedBrand />
      </div> */}

      <div className="flex justify-between items-center lg:mt-10 sm:mt-7 sm:gap-4 gap-2 ">
        <img
          className="lg:h-[440px] sm:h-[280px] h-[135px] w-auto object-contain"
          src={sale1.src}
          alt="sale1"
        />
        <img
          className="lg:h-[440px] sm:h-[280px]  h-[135px] w-auto object-contain"
          src={sale2.src}
          alt="sale2"
        />
      </div>
    </>
  );
};

export default AllProducts;












