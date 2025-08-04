"use client";

import React from "react";
import { PiBusFill } from "react-icons/pi";

const CheckoutProduct = ({ product }) => {

  if (!product) return null;


  if (!product?.medicine) {
    return (
      <div className="bg-blue-50 w-full rounded-lg py-10 px-5 text-center text-gray-900">
        No Product Found 
      </div>
    );
  }

  const medicine = product.medicine;
  const fallbackImage = "/assets/fallback.png";
  const imageUrl =
    Array.isArray(medicine.images) && medicine.images[0]
      ? medicine.images[0]
      : fallbackImage;

  const price = medicine?.price || 0;
  const discountPercent = parseFloat(medicine?.discount?.replace("%", "")) || 0;
  const discountedPrice = (price - (price * discountPercent) / 100).toFixed(2);

  return (
    <div className="bg-blue-50 w-full rounded-lg py-5">
      {/* Delivery Info */}
      <div className="flex gap-2 px-4 text-color items-center text-xs">
        <PiBusFill className="text-lg" /> Your delivery will arrive within 2
        days.
      </div>

      {/* Product Image */}
      <div className="flex justify-center md:w-full w-[80%] items-center mt-7 mx-auto">
        <img
          src={imageUrl}
          alt={medicine?.brandname || "product"}
          className="w-28 h-28 object-cover rounded-md"
        />
      </div>

      {/* Product Info */}
      <div className="mt-8 px-4">
        <h2 className="sm:text-sm text-xs font-light text-color mb-1">
          {medicine?.brandname || "brandname"}
        </h2>
        <h1 className="sm:text-2xl text-base font-bold text-gray-800">
          {medicine?.genericname || "N/A"}
        </h1>

        {/* Price Section */}
        <div className="flex items-center gap-3 mb-2 mt-3 sm:mt-5">
          <div className="sm:text-lg text-xs flex items-center gap-5">
            {discountPercent > 0 ? (
              <>
                <span className="opacity-55 line-through dark-text">
                  ₱{price}
                </span>
                <span className="font-medium text-[#333]">
                  ₱{discountedPrice}
                </span>
                <div className="bg-blue-100 text-color sm:text-base text-xs px-5 sm:py-1.5 py-0.5 rounded-full font-semibold z-10">
                  {discountPercent}%
                </div>
              </>
            ) : price > 0 ? (
              <span className="font-medium text-[#333]">₱{price}</span>
            ) : null}
          </div>
        </div>

        {/* Description */}
        <p className="opacity-60 leading-relaxed text-sm md:text-lg text-justify mt-5">
          {medicine?.description || "No description available."}
        </p>
      </div>
    </div>
  );
};

export default CheckoutProduct;
