"use client";

import React from "react";
import { useCartContext } from "@/app/contexts/CartContext";
import { usePrescriptionContext } from "@/app/contexts/PrescriptionContext";

const AddToCart = ({ productDetails, title, className = "" }) => {
  const { addToCart, getQuantity } = useCartContext();
  const { setIsOpen } = usePrescriptionContext();

  if (!productDetails) return null;

  const handleAddToCartClick = async () => {
    const qty = getQuantity(productDetails.id);
    await addToCart(productDetails.id, qty);

    if (productDetails.prescription) {
      setIsOpen(true);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAddToCartClick}
      // className="text-[11px] sm:text-base flex items-center gap-2 rounded-full font-medium py-2 px-6 justify-center bg-[#0070ba] hover:bg-[#005c96] text-white w-full shadow-lg transition-transform transform hover:scale-105 active:scale-95"
      className={`${className}`}
    >
      <i className="ri-shopping-cart-line text-xl"></i>
      {title}
    </button>
  );
};

export default AddToCart;
