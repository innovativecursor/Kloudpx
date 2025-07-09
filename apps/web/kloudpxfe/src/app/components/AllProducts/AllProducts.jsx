// import React from "react";
// import Title from "../Titles/Title";
// import ProductsCard from "@/app/components/cards/ProductsCard";
// import { useProductContext } from "@/app/contexts/ProductContext";

// const AllProducts = () => {
//   const { filteredItems, allMedicine } = useProductContext();

//   const productsToShow = filteredItems.length > 0 ? filteredItems : [];

//   return (
//     <>
//       <Title text="Recommended Items" />
//       <ProductsCard productsData={productsToShow} />
//     </>
//   );
// };

// export default AllProducts;






import React from "react";
import Title from "../Titles/Title";
import ProductsCard from "@/app/components/cards/ProductsCard";

const AllProducts = ({ productsData }) => {
  return (
    <>
      <Title text="Recommended Items" />
      <ProductsCard productsData={productsData || []} />
    </>
  );
};

export default AllProducts;
