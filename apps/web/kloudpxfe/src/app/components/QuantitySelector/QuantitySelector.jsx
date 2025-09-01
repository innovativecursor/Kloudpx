"use client";
import { useCartContext } from "@/app/contexts/CartContext";
import React, { useState, useEffect } from "react";

const QuantitySelector = ({ medicineid }) => {
  const { getQuantity, increaseQuantity, decreaseQuantity, setQuantityInCart } =
    useCartContext();

  const [quantity, setQuantity] = useState(getQuantity(medicineid));

  useEffect(() => {
    setQuantity(getQuantity(medicineid));
  }, [getQuantity(medicineid)]);

  const handleChange = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      const val = value === "" ? "" : parseInt(value);
      setQuantity(val);

      if (val >= 1) {
        setQuantityInCart(medicineid, val);
      }
    }
  };

  const handleBlur = () => {
    if (!quantity || quantity < 1) {
      setQuantity(1);
      setQuantityInCart(medicineid, 1);
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-100 border-2 border-gray-100 h-12 md:w-72 px-5 sm:text-3xl text-xl sm:w-52 w-full cursor-pointer rounded-full">
      <button
        onClick={() => decreaseQuantity(medicineid)}
        className="cursor-pointer bg-gray-100 shadow-md w-9 h-9 rounded-full"
      >
        -
      </button>

      <input
        type="text"
        value={quantity}
        onChange={handleChange}
        onBlur={handleBlur}
        className="text-center w-12 text-lg font-medium bg-gray-100 outline-none"
      />

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
