"use client";
import { useCartContext } from "@/app/contexts/CartContext";
import React, { useState } from "react";

const QuantitySelector = ({ medicineid }) => {
  const { getQuantity, increaseQuantity, decreaseQuantity } = useCartContext();
  const quantity = getQuantity(medicineid);

  return (
    <div className="mt-4 flex items-center justify-between bg-gray-100 sm:py-2 py-2 md:w-72 px-5 sm:text-3xl text-xl sm:w-52 w-full cursor-pointer rounded-full ">
      <button
        onClick={() => decreaseQuantity(medicineid)}
        className="cursor-pointer bg-gray-100 shadow-md w-9 h-9 rounded-full"
      >
        -
      </button>
      <span className="text-lg font-medium w-6 text-center">{quantity}</span>
      <button
        onClick={() => increaseQuantity(medicineid)}
        className="cursor-pointer bg-gray-100 shadow-md w-9 h-9 rounded-full"
      >
        +
      </button>
    </div>
  );
};
export default QuantitySelector;
