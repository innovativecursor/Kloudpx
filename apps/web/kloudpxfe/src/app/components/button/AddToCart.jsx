import React from "react";

const AddToCart = ({ title }) => {
  return (
    <button
      type="button"
      className="text-[11px] flex items-center gap-2 rounded-full font-medium py-2 justify-center bg-gray-200/50 cursor-pointer w-full"
    >
      <i className="ri-shopping-cart-line"></i>
      {title}
    </button>
  );
};

export default AddToCart;
