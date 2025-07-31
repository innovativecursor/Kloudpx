"use client";
import React from "react";
import ImageSwiper from "../ImageSwiper/ImageSwiper";
import { PiBusFill } from "react-icons/pi";

const CheckoutProduct = () => {
  return (
    <div className="bg-blue-50 w-full rounded-lg py-5">
      <div className="flex gap-2 px-4 text-color items-center text-xs ">
        <PiBusFill className="text-lg" /> Your delivery will arrive within 2 days.
      </div>
      <div className="flex justify-center bg-red-500 md:w-full w-[80%] items-center mt-7">
        {/* <ImageSwiper /> */}
      </div>
      <div className=" mt-8 px-4">
        <div className="flex items-start gap-8">
          <h2 className="sm:text-sm text-xs font-light text-color ">
            Supplemensts
          </h2>
        </div>
        <div className="flex items-start mt-1">
          <h1 className="sm:text-2xl text-base font-bold ">Magnesium Plus</h1>
        </div>
        <div className="flex items-center  gap-3 mb-2 mt-3 sm:mt-5">
          <div className="sm:text-lg text-xs flex items-center gap-5">
            <span className="opacity-55 line-through dark-text ">₱5000</span>
            <span className=" font-medium">₱40000</span>

            <div className=" bg-blue-100 text-color  sm:text-base text-xs  px-5 sm:py-1.5 py-0.5 rounded-full font-semibold z-10">
              20
            </div>
          </div>
        </div>

        <span className="opacity-60 leading-relaxed items-start mb-4 mt-5 text-sm md:text-lg text-justify">
          description available
        </span>
      </div>
    </div>
  );
};

export default CheckoutProduct;