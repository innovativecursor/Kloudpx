"use client";
import React from "react";
import QuantitySelector from "../QuantitySelector/QuantitySelector";
import AddToCart from "../button/AddToCart";
import SocialIcons from "../SocialIcons/SocialIcons";
import { RiTruckLine, RiArrowGoBackLine } from "react-icons/ri";

const ProductDeatilsCard = ({ details }) => {
  const price = Number(details?.price);
  const rawDiscount =
    typeof details?.discount === "string"
      ? details.discount
      : `${details?.discount || 0}`;
  const discountPercent =
    parseFloat(rawDiscount.replace(/[^\d.]/g, "").trim()) || 0;
  const discountedPrice = price - (price * discountPercent) / 100;

  return (
    <div className="">
      <div className="">
        <div className="flex items-start gap-8 sm:mb-5 mb-4">
          <h2 className="lg:text-xl sm:text-lg text-sm font-light text-color ">
            {details?.brandname || "brandname Medicine"}
          </h2>
          {/* <SocialIcons /> */}
        </div>
        <div className="flex items-start md:mt-3 sm:gap-8 gap-4">
          <h1 className="lg:text-4xl sm:text-2xl text-xl font-bold ">
            {details?.genericname} {details?.power}
          </h1>
          <SocialIcons />
        </div>
        <div className="flex items-center md:gap-5 gap-3 mb-2 mt-4 lg:mt-8">
          {price ? (
            discountPercent > 0 ? (
              <div className="lg:text-2xl sm:text-lg text-base flex items-center sm:gap-5 gap-3">
                <span className="opacity-55 line-through dark-text ">
                  ₱{price.toFixed(2)}
                </span>
                <span className=" font-medium">
                  ₱{discountedPrice.toFixed(2)}
                </span>

                <div className=" bg-blue-100 text-color  lg:text-base sm:text-sm text-xs sm:px-5 px-3  py-1 rounded-full font-semibold z-10">
                  {details?.discount}
                </div>
              </div>
            ) : (
              <span className="text-2xl font-semibold dark-text ">
                ₱{price.toFixed(2)}
              </span>
            )
          ) : (
            <span className="text-red-500">Price not available</span>
          )}
        </div>

        <p className="opacity-60 leading-relaxed items-start sm:mb-6 mb-3 sm:mt-5 mt-4 sm:text-sm text-xs md:text-lg text-justify">
          {details?.description || "No description available."}
        </p>

        <div className="flex justify-between  sm:flex-row flex-col md:gap-10 gap-5  items-start">
          <QuantitySelector medicineid={details.id} />

          <AddToCart
            productDetails={details}
            title="Add To Cart"
            className="bg-[#0070ba] w-full flex items-center justify-center h-12 gap-2 text-white rounded-full cursor-pointer"
          />
        </div>
      </div>

      <div className="w-full mx-auto rounded-lg bg-[#EDF4F6]   sm:mt-12 mt-7">
        <div className="flex tracking-wide items-start sm:gap-4 gap-2 p-4 border-b border-blue-100">
          <RiTruckLine className="w-8 h-8 mt-0.5 text-blue-900" />
          <div>
            <h1 className="font-semibold text-blue-950 sm:text-sm text-xs ">
              Your delivery will arrive soon based on your location.
            </h1>
            <h1 className=" text-xs sm:mt-2 mt-1 sm:text-xs text-[9px]">
              Enter your postal code for Delivery Availability
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDeatilsCard;
