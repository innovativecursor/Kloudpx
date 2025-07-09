// "use client";

// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { useProductContext } from "../contexts/ProductContext";
// import ProductsFilter from "../components/filter/ProductsFilter";
// import AllProducts from "../components/AllProducts/AllProducts";
// import SubTitle from "../components/Titles/SubTitle";

// const Page = () => {
//   const searchParams = useSearchParams();
//   const [selectedId, setSelectedId] = useState(null);

//   const {
//     getItemsByCategory,
//     selectedCategoryName,
//     getAllMedicine,
//     getCategory,
//     category,
//     loading,
//   } = useProductContext();

//   useEffect(() => {
//     const id = searchParams.get("category");
//     setSelectedId(id);
//   }, [searchParams]);

//   useEffect(() => {
//     getAllMedicine();
//     getCategory();
//   }, []);

//   useEffect(() => {
//     if (selectedId && category.length > 0) {
//       getItemsByCategory(selectedId);
//     }
//   }, [selectedId, category]);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="bg-gray-100">
//       <div className="responsive-mx pt-5 md:pt-7">
//         <SubTitle paths={["Home", selectedCategoryName || "Category"]} />
//         <div className="flex mt-7">
//           <ProductsFilter />
//           <div className="flex-1 md:ml-9">
//             <AllProducts />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;











"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProductContext } from "../contexts/ProductContext";
import ProductsFilter from "../components/filter/ProductsFilter";
import AllProducts from "../components/AllProducts/AllProducts";
import SubTitle from "../components/Titles/SubTitle";
import { store } from "@/app/redux/store";

const Page = () => {
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);

  const {
    getItemsByCategory,
    selectedCategoryName,
    getAllMedicine,
    getCategory,
    allMedicine,
    category,
  } = useProductContext();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        store.dispatch({ type: "LOADING", payload: true });
        await Promise.all([getAllMedicine(), getCategory()]);
      } finally {
        store.dispatch({ type: "LOADING", payload: false });
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const id = searchParams.get("category");
    setSelectedId(id);
  }, [searchParams]);

  useEffect(() => {
    const fetchByCategory = async () => {
      if (selectedId && category.length > 0) {
        const data = await getItemsByCategory(selectedId);
        setFilteredItems(data || []);
      }
    };
    fetchByCategory();
  }, [selectedId, category]);

  const productsToShow = filteredItems.length > 0 ? filteredItems : allMedicine;

  return (
    <div className="bg-gray-100">
      <div className="responsive-mx pt-5 md:pt-7">
        <SubTitle paths={["Home", selectedCategoryName || "Category"]} />
        <div className="flex mt-7">
          <ProductsFilter />
          <div className="flex-1 md:ml-9">
            <AllProducts productsData={productsToShow} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
