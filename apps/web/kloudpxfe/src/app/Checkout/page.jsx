"use client";

import React, { useEffect, useState } from "react";
import SubTitle from "../components/Titles/SubTitle";
import CheckoutContent from "../components/CheckoutContent/CheckoutContent";
import CheckoutProduct from "../components/CheckoutContent/CheckoutProduct";
import { useCartContext } from "../contexts/CartContext";

const page = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { getCartData } = useCartContext();

  useEffect(() => {
    if (getCartData?.data && getCartData.data.length > 0) {
      setSelectedProduct(getCartData.data[0]);
    }
  }, [getCartData?.data]);

  return (
    <div className=" pb-10 min-h-screen md:mt-52 sm:mt-48 mt-32">
      <div className="responsive-mx pt-7 md:pt-11">
        <div className="flex justify-between md:flex-row flex-col md:gap-0 gap-10 items-start">
          <div className="md:w-[45%] w-full flex flex-col">
            <SubTitle paths={["Cart", "Checkout"]} />
            <CheckoutContent setSelectedProduct={setSelectedProduct} />
          </div>
          <div className="md:w-[40%] w-full">
            <CheckoutProduct product={selectedProduct} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

// "use client";

// import React, { useEffect, useState } from "react";
// import SubTitle from "../components/Titles/SubTitle";
// import CheckoutContent from "../components/CheckoutContent/CheckoutContent";
// import CheckoutProduct from "../components/CheckoutContent/CheckoutProduct";
// import { useCartContext } from "@/app/contexts/CartContext";  // CartContext import karo

// const page = () => {
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const { getCartData } = useCartContext();

//   // Jab cart data aaye, uska pehla item select kar do by default
//   useEffect(() => {
//     if (getCartData?.data && getCartData.data.length > 0) {
//       setSelectedProduct(getCartData.data[0]);
//     }
//   }, [getCartData?.data]);

//   return (
//     <div className="pb-10 min-h-screen md:mt-52 sm:mt-48 mt-32">
//       <div className="responsive-mx pt-7 md:pt-11">
//         <div className="flex justify-between md:flex-row flex-col md:gap-0 gap-10 items-start">
//           <div className="md:w-[45%] w-full flex flex-col">
//             <SubTitle paths={["Cart", "Checkout"]} />
//             <CheckoutContent setSelectedProduct={setSelectedProduct} />
//           </div>
//           <div className="md:w-[40%] w-full">
//             <CheckoutProduct product={selectedProduct} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default page;
