// "use client";

// import React, { useEffect, useRef } from "react";
// import { useSearchParams } from "next/navigation";
// import { useProductContext } from "../contexts/ProductContext";
// import ProductsFilter from "../components/filter/ProductsFilter";
// import AllProducts from "../components/AllProducts/AllProducts";
// import Hero from "../components/Hero/Hero";
// import Sorting from "../components/sorting/Sorting";

// const Page = () => {
//   const searchParams = useSearchParams();
//   const scrollRef = useRef(null);

//   const {
//     filteredMedicines,
//     selectedCategories,
//     selectedBrands,
//     priceRange,
//     discountRange,
//   } = useProductContext();

//   useEffect(() => {
//     const isFilterActive =
//       filteredMedicines.length > 0 ||
//       selectedCategories.length > 0 ||
//       selectedBrands.length > 0 ||
//       priceRange[0] > 0 ||
//       priceRange[1] < 1000 ||
//       discountRange[0] > 0 ||
//       discountRange[1] < 100;

//     if (isFilterActive && scrollRef.current) {
//       scrollRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [
//     filteredMedicines,
//     selectedCategories,
//     selectedBrands,
//     priceRange,
//     discountRange,
//   ]);

//   return (
//     <>
//       <Hero />
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col sm:flex-row sm:space-x-4">
//           {/* Left Filter */}
//           <div className="sm:w-[300px] w-full sm:sticky top-10 sm:h-screen">
//             <ProductsFilter />
//           </div>

//           {/* Right Products Area */}
//           <div className="flex-1 mt-4 sm:mt-0">
//             <Sorting />
            
//             {/* Invisible anchor just before products */}
//             <div ref={scrollRef} />

//             <AllProducts />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Page;









// ADD on 
// monthly subscrition....