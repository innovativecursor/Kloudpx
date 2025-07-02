"use client";
import { useCartContext } from "@/app/contexts/CartContext";
import React, { useState } from "react";

const QuantitySelector = () => {
  const { decrease, quantity, increase } = useCartContext();
  // console.log(quantity);

  return (
    <div className="mt-4 flex items-center gap-4">
      <button
        onClick={decrease}
        className="w-8 h-8 rounded-full bg-gray-200 text-lg font-bold hover:bg-gray-300"
      >
        -
      </button>
      <span className="text-lg font-medium w-6 text-center">{quantity}</span>
      <button
        onClick={increase}
        className="w-8 h-8 rounded-full bg-gray-200 text-lg font-bold hover:bg-gray-300"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;











