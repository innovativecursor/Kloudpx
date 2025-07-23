"use client";
import { useCartContext } from "@/app/contexts/CartContext";
import React, { useState } from "react";

const QuantitySelector = ({ medicineid }) => {
  const { getQuantity, increaseQuantity, decreaseQuantity } = useCartContext();
  const quantity = getQuantity(medicineid);

  return (
    <div className="mt-4 flex items-center justify-between bg-gray-100 sm:py-3 py-2 md:w-60 px-5 sm:text-3xl text-xl w-40 cursor-pointer rounded-full ">
      <button
        onClick={() => decreaseQuantity(medicineid)}
        // className="w-8 h-8 rounded-full bg-gray-200 text-lg font-bold hover:bg-gray-300"
        className="cursor-pointer"
      >
        -
      </button>
      <span className="text-lg font-medium w-6 text-center">{quantity}</span>
      <button
        onClick={() => increaseQuantity(medicineid)}
         className="cursor-pointer"
        // className="w-8 h-8 rounded-full bg-gray-200 text-lg font-bold hover:bg-gray-300"
      >
        +
      </button>
    </div>
  );
};
export default QuantitySelector;
