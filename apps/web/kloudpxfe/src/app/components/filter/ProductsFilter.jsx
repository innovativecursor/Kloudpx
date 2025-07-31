// "use client";

// import React, { useEffect, useState } from "react";
// import { Range } from "react-range";
// import { CiFilter } from "react-icons/ci";
// import { useProductContext } from "@/app/contexts/ProductContext";

// const ProductsFilter = () => {
//   const { category, branded, getAllBrand } = useProductContext();

//   const [priceRange, setPriceRange] = useState([0, 1000]);
//   const [discountRange, setDiscountRange] = useState([0, 100]);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);

//   useEffect(() => {
//     if (!branded || branded.length === 0) {
//       getAllBrand();
//     }
//   }, []);

//   const FilterContent = () => (
//     <div className="bg-gray-100 h-full overflow-y-auto p-5">
//       {/* Category */}
//       <span className="font-medium text-lg tracking-wide dark-text">Category</span>
//       {category?.map((item) => (
//         <div
//           key={item.ID}
//           className="flex items-center gap-2 mt-3 rounded px-2 py-1 cursor-default"
//         >
//           <input
//             type="checkbox"
//             disabled
//             className="w-4 h-4 bg-transparent accent-[#0070ba] cursor-not-allowed"
//           />
//           <span className="text-sm tracking-wider">
//             {(item?.CategoryName?.slice(0, 15) || "No CategoryName") +
//               (item?.CategoryName?.length > 20 ? "... " : "")}
//           </span>
//         </div>
//       ))}

//       {/* Brands */}
//       <div className="mt-8">
//         <span className="font-medium text-lg tracking-wide dark-text">Brands</span>
//         {branded.map(({ brandname, id }) => (
//           <div key={id} className="flex items-center gap-2 mt-3 cursor-default">
//             <input
//               type="checkbox"
//               disabled
//               className="w-4 h-4 bg-transparent accent-[#0070ba] cursor-not-allowed"
//             />
//             <span className="text-sm tracking-wider">{brandname}</span>
//           </div>
//         ))}
//       </div>

//       {/* Price Range */}
//       <div className="mt-10">
//         <div className="flex justify-between items-center mb-2 cursor-default">
//           <span className="font-medium text-lg tracking-wide dark-text">Price</span>
//           <i className="ri-arrow-drop-up-line text-xl"></i>
//         </div>

//         <Range
//           step={50}
//           min={0}
//           max={1000}
//           values={priceRange}
//           onChange={(values) => setPriceRange(values)}
//           renderTrack={({ props, children }) => {
//             const { key, ...rest } = props;
//             return (
//               <div
//                 key={key}
//                 {...rest}
//                 className="h-1.5 bg-gray-200 rounded relative w-full"
//               >
//                 <div
//                   className="absolute h-1.5 bg-[#0070ba] rounded"
//                   style={{
//                     left: `${(priceRange[0] / 1000) * 100}%`,
//                     width: `${((priceRange[1] - priceRange[0]) / 1000) * 100}%`,
//                   }}
//                 />
//                 {children}
//               </div>
//             );
//           }}
//           renderThumb={({ props }) => {
//             const { key, ...restProps } = props;
//             return (
//               <div
//                 key={key}
//                 {...restProps}
//                 className="h-4 w-4 bg-[#0070ba] rounded-full cursor-pointer"
//               />
//             );
//           }}
//         />
//         <div className="flex justify-between text-sm mt-2">
//           <span>₱{priceRange[0].toFixed(2)}</span>
//           <span>₱{priceRange[1].toFixed(2)}</span>
//         </div>
//       </div>

//       {/* Discount */}
//       <div className="mt-12 mb-20">
//         <div className="flex justify-between items-center mb-2 cursor-default">
//           <span className="font-medium text-lg tracking-wide dark-text">Discount</span>
//           <i className="ri-arrow-drop-up-line text-xl"></i>
//         </div>

//         <Range
//           step={1}
//           min={0}
//           max={100}
//           values={discountRange}
//           onChange={(values) => setDiscountRange(values)}
//           renderTrack={({ props, children }) => {
//             const { key, ...rest } = props;
//             return (
//               <div
//                 key={key}
//                 {...rest}
//                 className="h-1.5 bg-gray-200 rounded relative w-full"
//               >
//                 <div
//                   className="absolute h-1.5 bg-[#0070ba] rounded"
//                   style={{
//                     left: `${(discountRange[0] / 100) * 100}%`,
//                     width: `${((discountRange[1] - discountRange[0]) / 100) * 100}%`,
//                   }}
//                 />
//                 {children}
//               </div>
//             );
//           }}
//           renderThumb={({ props }) => {
//             const { key, ...restProps } = props;
//             return (
//               <div
//                 key={key}
//                 {...restProps}
//                 className="h-4 w-4 bg-[#0070ba] rounded-full cursor-pointer"
//               />
//             );
//           }}
//         />
//         <div className="flex justify-between text-sm mt-2">
//           <span>{discountRange[0]}%</span>
//           <span>{discountRange[1]}%</span>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {/* Desktop sidebar */}
//       <div className="w-full lg:w-[20%] md:w-[30%] hidden md:block mt-4 rounded-lg sticky top-20 max-h-fit overflow-auto">
//         <div className="bg-gray-100">
//           <div className="flex justify-between items-center py-4 px-5 bg-[#0070ba] text-white rounded-tl-xl rounded-tr-xl font-medium text-xl">
//             <span>Filter</span>
//             <i className="ri-sound-module-line"></i>
//           </div>
//           {FilterContent()}
//         </div>
//       </div>

//       {/* Mobile Drawer Trigger */}
//       <div
//         className="fixed bottom-0 right-0 border-l border-l-gray-200 w-1/2 bg-white text-sm dark-text border-t border-gray-300 shadow-md text-center py-3 md:hidden cursor-default z-30 font-medium"
//         onClick={() => setIsMobileOpen(true)}
//       >
//         <div className="flex justify-center items-center">
//           <CiFilter /> FILTER
//         </div>
//       </div>

//       {/* Mobile Drawer */}
//       {isMobileOpen && (
//         <div className="fixed inset-0 bg-black/40 z-50 md:hidden">
//           <div className="absolute left-0 right-0 bg-white rounded-t-xl h-full overflow-y-auto">
//             <div className="flex justify-between items-center px-4 py-3 border-b">
//               <span className="font-semibold text-lg">Filters</span>
//               <button onClick={() => setIsMobileOpen(false)}>
//                 <i className="ri-close-line text-2xl"></i>
//               </button>
//             </div>
//             {FilterContent()}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ProductsFilter;



































































































// "use client";

// import React, { useEffect, useState } from "react";
// import { Range } from "react-range";
// import { CiFilter } from "react-icons/ci";
// import { useProductContext } from "@/app/contexts/ProductContext";
// import axios from "axios";

// const ProductsFilter = () => {
//   const { category, branded, getAllBrand } = useProductContext();

//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [selectedBrands, setSelectedBrands] = useState([]);
//   const [priceRange, setPriceRange] = useState([0, 1000]);
//   const [discountRange, setDiscountRange] = useState([0, 100]);
//   const [filteredMedicines, setFilteredMedicines] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);

//   useEffect(() => {
//     if (!branded?.length) getAllBrand();
//   }, []);

//   useEffect(() => {
//     fetchFilteredMedicines();
//   }, [selectedCategories, selectedBrands, priceRange, discountRange]);

//   const fetchFilteredMedicines = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();

//       selectedCategories.forEach((catId) => {
//         params.append("category_ids", catId.toString());
//       });

//       selectedBrands.forEach((brand) => {
//         params.append("brands", brand);
//       });

//       if (priceRange[0] > 0) params.append("min_price", priceRange[0]);
//       if (priceRange[1] < 1000) params.append("max_price", priceRange[1]);

//       if (discountRange[0] > 0) params.append("min_discount", discountRange[0]);
//       if (discountRange[1] < 100) params.append("max_discount", discountRange[1]);

//       const res = await axios.get("http://localhost:10003/v1/user/filter", {
//         params,
//       });

//       // console.log(res?.data);
      

//       if (res?.data?.medicines) {
//         setFilteredMedicines(res.data.medicines);
//       } else {
//         setFilteredMedicines([]);
//       }
//     } catch (err) {
//       console.error("Failed to fetch filtered medicines", err);
//       setFilteredMedicines([]);
//     }
//     setLoading(false);
//   };

//   const handleCategoryChange = (id) => {
//     setSelectedCategories((prev) =>
//       prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
//     );
//   };

//   const handleBrandChange = (brand) => {
//     setSelectedBrands((prev) =>
//       prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
//     );
//   };

//   console.log(filteredMedicines);
  

//   const FilterContent = () => (
//     <div className="bg-gray-100 h-full overflow-y-auto p-5">
//       {/* Category Filter */}
//       <div>
//         <span className="font-medium text-lg">Category</span>
//         {category?.map((item) => (
//           <label
//             key={item.ID}
//             className="flex items-center gap-2 mt-3 cursor-pointer"
//           >
//             <input
//               type="checkbox"
//               checked={selectedCategories.includes(item.ID)}
//               onChange={() => handleCategoryChange(item.ID)}
//               className="w-4 h-4 accent-[#0070ba]"
//             />
//             <span className="text-sm">{item.CategoryName}</span>
//           </label>
//         ))}
//       </div>

//       {/* Brands Filter */}
//       <div className="mt-8">
//         <span className="font-medium text-lg">Brands</span>
//         {branded?.map(({ brandname, id }) => (
//           <label
//             key={id}
//             className="flex items-center gap-2 mt-3 cursor-pointer"
//           >
//             <input
//               type="checkbox"
//               checked={selectedBrands.includes(brandname)}
//               onChange={() => handleBrandChange(brandname)}
//               className="w-4 h-4 accent-[#0070ba]"
//             />
//             <span className="text-sm">{brandname}</span>
//           </label>
//         ))}
//       </div>

//       {/* Price Filter */}
//       <div className="mt-10">
//         <div className="flex justify-between">
//           <span className="font-medium text-lg">Price</span>
//         </div>
//         <Range
//           step={50}
//           min={0}
//           max={1000}
//           values={priceRange}
//           onChange={setPriceRange}
//           renderTrack={({ props, children }) => (
//             <div
//               {...props}
//               className="h-1.5 bg-gray-200 rounded relative w-full"
//             >
//               <div
//                 className="absolute h-1.5 bg-[#0070ba] rounded"
//                 style={{
//                   left: `${(priceRange[0] / 1000) * 100}%`,
//                   width: `${((priceRange[1] - priceRange[0]) / 1000) * 100}%`,
//                 }}
//               />
//               {children}
//             </div>
//           )}
//           renderThumb={({ props }) => (
//             <div
//               {...props}
//               className="h-4 w-4 bg-[#0070ba] rounded-full cursor-pointer"
//             />
//           )}
//         />
//         <div className="flex justify-between text-sm mt-2">
//           <span>₱{priceRange[0]}</span>
//           <span>₱{priceRange[1]}</span>
//         </div>
//       </div>

//       {/* Discount Filter */}
//       <div className="mt-10 mb-20">
//         <div className="flex justify-between">
//           <span className="font-medium text-lg">Discount</span>
//         </div>
//         <Range
//           step={1}
//           min={0}
//           max={100}
//           values={discountRange}
//           onChange={setDiscountRange}
//           renderTrack={({ props, children }) => (
//             <div
//               {...props}
//               className="h-1.5 bg-gray-200 rounded relative w-full"
//             >
//               <div
//                 className="absolute h-1.5 bg-[#0070ba] rounded"
//                 style={{
//                   left: `${(discountRange[0] / 100) * 100}%`,
//                   width: `${((discountRange[1] - discountRange[0]) / 100) * 100}%`,
//                 }}
//               />
//               {children}
//             </div>
//           )}
//           renderThumb={({ props }) => (
//             <div
//               {...props}
//               className="h-4 w-4 bg-[#0070ba] rounded-full cursor-pointer"
//             />
//           )}
//         />
//         <div className="flex justify-between text-sm mt-2">
//           <span>{discountRange[0]}%</span>
//           <span>{discountRange[1]}%</span>
//         </div>
//       </div>

//       {/* Result Info */}
//       {loading ? (
//         <div className="text-center text-blue-600 font-medium">Loading...</div>
//       ) : (
//         <div className="text-center text-gray-700">{filteredMedicines.length} medicines found</div>
//       )}
//     </div>
//   );

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <div className="w-full lg:w-[20%] md:w-[30%] hidden md:block mt-4 rounded-lg sticky top-20 overflow-auto">
//         <div className="bg-gray-100 rounded-xl">
//           <div className="flex justify-between items-center py-4 px-5 bg-[#0070ba] text-white rounded-t-xl font-medium text-xl">
//             <span>Filter</span>
//           </div>
//           {FilterContent()}
//         </div>
//       </div>

//       {/* Mobile Drawer Trigger */}
//       <div
//         className="fixed bottom-0 right-0 w-1/2 bg-white border-t border-l px-4 py-3 text-center md:hidden z-30 cursor-pointer shadow-sm"
//         onClick={() => setIsMobileOpen(true)}
//       >
//         <div className="flex justify-center items-center gap-1 font-medium text-sm">
//           <CiFilter size={18} />
//           FILTER
//         </div>
//       </div>

//       {/* Mobile Drawer */}
//       {isMobileOpen && (
//         <div className="fixed inset-0 z-50 bg-black/30 md:hidden">
//           <div className="absolute left-0 right-0 bg-white h-full rounded-t-xl overflow-y-auto">
//             <div className="flex justify-between items-center px-4 py-3 border-b">
//               <span className="font-semibold text-lg">Filters</span>
//               <button onClick={() => setIsMobileOpen(false)}>
//                 <i className="ri-close-line text-2xl"></i>
//               </button>
//             </div>
//             {FilterContent()}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ProductsFilter;





















































"use client";

import React, { useEffect, useState } from "react";
import { Range } from "react-range";
import { CiFilter } from "react-icons/ci";
import { useProductContext } from "@/app/contexts/ProductContext";

const ProductsFilter = () => {
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
    filteredMedicines,
    loading,
    getAllBrand 
  } = useProductContext();

   useEffect(() => {
     if (!branded || branded.length === 0) {
       getAllBrand();
     }
   }, []);

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const FilterContent = () => (
    <div className="bg-gray-100 h-full overflow-y-auto p-5">
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
              className="w-4 h-4 accent-[#0070ba]"
            />
            <span className="text-sm">{item.CategoryName}</span>
          </label>
        ))}
      </div>

      {/* Brands Filter */}
      <div className="mt-8">
        <span className="font-medium text-lg">Brands</span>
        {branded?.map(({ brandname, id }) => (
          <label
            key={id}
            className="flex items-center gap-2 mt-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedBrands.includes(brandname)}
              onChange={() => handleBrandChange(brandname)}
              className="w-4 h-4 accent-[#0070ba]"
            />
            <span className="text-sm">{brandname}</span>
          </label>
        ))}
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
          renderThumb={({ props }) => (
            <div
              {...props}
              className="h-4 w-4 bg-[#0070ba] rounded-full cursor-pointer"
            />
          )}
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
          renderThumb={({ props }) => (
            <div
              {...props}
              className="h-4 w-4 bg-[#0070ba] rounded-full cursor-pointer"
            />
          )}
        />
        <div className="flex justify-between text-sm mt-2">
          <span>{discountRange[0]}%</span>
          <span>{discountRange[1]}%</span>
        </div>
      </div>

      {/* Result Info */}
      {/* {loading ? (
        <div className="text-center text-blue-600 font-medium">Loading...</div>
      ) : (
        <div className="text-center text-gray-700">
          {filteredMedicines.length} medicines found
        </div>
      )} */}
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
        className="fixed bottom-0 right-0 w-1/2 bg-white border-t border-l px-4 py-3 text-center md:hidden z-30 cursor-pointer shadow-sm"
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
