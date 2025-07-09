// "use client";

// import { createContext, useContext, useState, useEffect } from "react";
// import endpoints from "../config/endpoints";
// import { getAxiosCall } from "@/app/lib/axios";

// const ProductContext = createContext();

// export const ProductProvider = ({ children }) => {
//   const [allMedicine, setAllMedicine] = useState([]);
//   const [category, setCategory] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [selectedCategoryName, setSelectedCategoryName] = useState("");
//   const [loading, setLoading] = useState(true);

//   const getAllMedicine = async () => {
//     try {
//       const res = await getAxiosCall(endpoints.medicine.get, {}, false);
//       setAllMedicine(res?.data?.medicines || []);
//     } catch (error) {
//       setAllMedicine([]);
//     }
//   };

//   const getCategory = async () => {
//     try {
//       const res = await getAxiosCall(endpoints.category.getAll, {}, false);
//       setCategory(res?.data?.categories || []);
//     } catch (error) {
//       setCategory([]);
//     }
//   };

//   const getItemsByCategory = async (id) => {
//     setFilteredItems([]);
//     try {
//       const res = await getAxiosCall(
//         endpoints.category.getItemsByCategory(id),
//         {},
//         false
//       );
//       setFilteredItems(res?.data?.medicines || []); // medicines array

//       const matched = category.find((cat) => cat.ID === Number(id));
//       setSelectedCategoryName(matched?.CategoryName || "Unknown Category");
//     } catch (error) {
//       setFilteredItems([]);
//       setSelectedCategoryName("");
//     }
//   };

//   useEffect(() => {
//     Promise.all([getAllMedicine(), getCategory()]).finally(() =>
//       setLoading(false)
//     );
//   }, []);

//   return (
//     <ProductContext.Provider
//       value={{
//         allMedicine,
//         category,
//         filteredItems,
//         getItemsByCategory,
//         selectedCategoryName,
//         getAllMedicine,
//         getCategory,
//         loading,
//       }}
//     >
//       {children}
//     </ProductContext.Provider>
//   );
// };

// export const useProductContext = () => useContext(ProductContext);





"use client";

import { createContext, useContext, useState } from "react";
import endpoints from "../config/endpoints";
import { getAxiosCall } from "@/app/lib/axios";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [allMedicine, setAllMedicine] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const getAllMedicine = async () => {
    try {
      const res = await getAxiosCall(endpoints.medicine.get, {}, false, true);
      setAllMedicine(res?.data?.medicines || []);
    } catch (error) {
      setAllMedicine([]);
    }
  };

  const getCategory = async () => {
    try {
      const res = await getAxiosCall(endpoints.category.getAll, {}, false, true);
      setCategory(res?.data?.categories || []);
    } catch (error) {
      setCategory([]);
    }
  };

  const getItemsByCategory = async (id) => {
    try {
      const res = await getAxiosCall(endpoints.category.getItemsByCategory(id), {}, false, true);
      const matched = category.find((cat) => cat.ID === Number(id));
      setSelectedCategoryName(matched?.CategoryName || "Unknown Category");
      return res?.data?.medicines || [];
    } catch (error) {
      setSelectedCategoryName("");
      return [];
    }
  };

  return (
    <ProductContext.Provider
      value={{
        allMedicine,
        category,
        selectedCategoryName,
        getItemsByCategory,
        getAllMedicine,
        getCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
