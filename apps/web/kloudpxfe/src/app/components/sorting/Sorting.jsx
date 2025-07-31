// "use client";

// import React, { useState, useEffect } from "react";
// import { BiSortAlt2 } from "react-icons/bi";
// import { useProductContext } from "@/app/contexts/ProductContext";

// const options = [
//   "Popular",
//   "Discounts",
//   "Cost: high to Low",
//   "Cost: Low to High",
// ];

// const Sorting = () => {
//   const {
//     selectedCategoryId,
//     getSortedItemsByCategory,
//     activeSort,
//     setActiveSort,
//   } = useProductContext();

//   const [isMobileOpen, setIsMobileOpen] = useState(false);

//   useEffect(() => {
//     if (selectedCategoryId) {
//       getSortedItemsByCategory(selectedCategoryId, activeSort);
//     }
//   }, [selectedCategoryId, activeSort]);

//   return (
//     <>
//       <div className="hidden md:flex items-center lg:gap-4 md:gap-3 flex-wrap">
//         <span className="font-medium dark-text mr-3">Sort by:</span>
//         {options.map((option) => (
//           <button
//             key={option}
//             onClick={() => setActiveSort(option)}
//             className={`lg:px-5 md:px-3 py-2 rounded-md cursor-pointer lg:text-sm md:text-xs font-normal transition 
//               ${
//                 activeSort === option
//                   ? "bg-blue-200 dark-text font-semibold"
//                   : "bg-blue-50 text-gray-800 hover:bg-blue-100"
//               }`}
//           >
//             {option}
//           </button>
//         ))}
//       </div>

//       <div
//         className="fixed bottom-0 left-0 w-1/2 bg-white text-sm dark-text border-t border-gray-300 shadow-md text-center py-3 md:hidden cursor-pointer z-30 font-medium"
//         onClick={() => setIsMobileOpen(true)}
//       >
//         <div className="flex justify-center items-center">
//           <BiSortAlt2 /> SORT
//         </div>
//       </div>
//       {isMobileOpen && (
//         <>
//           {/* Overlay */}
//           <div
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
//             onClick={() => setIsMobileOpen(false)}
//           />

//           {/* Bottom Sheet Modal */}
//           <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl h-[55vh] p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] transition-all duration-300">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-4 border-b pb-2 border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-800">Sort By</h3>
//               <button
//                 className="text-gray-500 text-2xl"
//                 onClick={() => setIsMobileOpen(false)}
//               >
//                 &times;
//               </button>
//             </div>

//             {/* Options List */}
//             <div className="overflow-y-auto flex flex-col gap-2 h-full pr-1 custom-scroll">
//               {options.map((option) => (
//                 <button
//                   key={option}
//                   onClick={() => {
//                     setActiveSort(option);
//                     setIsMobileOpen(false);
//                   }}
//                   className={`flex items-center justify-between w-full px-4 py-3 text-sm rounded-xl transition-all duration-200
//               ${
//                 activeSort === option
//                   ? "bg-blue-100 text-blue-700 font-semibold shadow-inner"
//                   : "text-gray-700 hover:bg-gray-100"
//               }`}
//                 >
//                   <span>{option}</span>
//                   {activeSort === option && (
//                     <span className="text-blue-600 text-lg font-bold">
//                       &#10003;
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default Sorting;






import React from 'react'

const Sorting = () => {
  return (
    <div>
      sdsd
    </div>
  )
}

export default Sorting
