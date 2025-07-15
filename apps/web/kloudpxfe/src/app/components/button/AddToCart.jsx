// import React from "react";

// const AddToCart = ({ title }) => {
//   return (
//     <button
//       type="button"
//       className="text-[11px] flex items-center gap-2 rounded-full font-medium py-2 justify-center bg-gray-200/50 cursor-pointer w-full"
//     >
//       <i className="ri-shopping-cart-line"></i>
//       {title}
//     </button>
//   );
// };

// export default AddToCart;

"use client";

import React from "react";
import { useCartContext } from "@/app/contexts/CartContext";
import { usePrescriptionContext } from "@/app/contexts/PrescriptionContext";

const AddToCart = ({ productDetails, title }) => {
  const { addToCart, getQuantity } = useCartContext();
  const { setIsOpen } = usePrescriptionContext();

  if (!productDetails) return null;

  const handleAddToCartClick = () => {
    if (productDetails.prescription) {
      setIsOpen(true);
      return;
    }

    const qty = getQuantity(productDetails.id);
    addToCart(productDetails.id, qty);
  };

  return (
    <button
      type="button"
      onClick={handleAddToCartClick}
      className="text-[11px] sm:text-base flex items-center gap-2 rounded-full font-medium py-2 px-6 justify-center bg-[#0070ba] hover:bg-[#005c96] text-white w-full shadow-lg transition-transform transform hover:scale-105 active:scale-95"
    >
      <i className="ri-shopping-cart-line text-xl"></i>
      {title}
    </button>
  );
};

export default AddToCart;
