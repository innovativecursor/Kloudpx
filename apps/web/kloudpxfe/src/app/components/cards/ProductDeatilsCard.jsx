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
        <div className="flex items-start gap-8 mb-6">
          <h2 className="sm:text-xl text-lg font-light text-color ">
            {details?.genericname || "General Medicine"}
          </h2>
          {/* <SocialIcons /> */}
        </div>
        <div className="flex items-start gap-8">
          <h1 className="sm:text-4xl text-2xl font-bold ">
            {details?.brandname} {details?.power}
          </h1>
          <SocialIcons />
        </div>
        <div className="flex items-center  gap-3 mb-2 mt-5 sm:mt-8">
          {price ? (
            discountPercent > 0 ? (
              <div className="text-2xl flex items-center gap-5">
                <span className="opacity-55 line-through dark-text ">
                  ₱{price.toFixed(2)}
                </span>
                <span className=" font-medium">
                  ₱{discountedPrice.toFixed(2)}
                </span>

                <div className=" bg-blue-100 text-color  text-base px-5 py-1.5 rounded-full font-semibold z-10">
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

        <p className="opacity-60 leading-relaxed items-start sm:mb-10 mb-4 mt-5 text-sm md:text-lg text-justify">
          {details?.description || "No description available."}
        </p>

        <div className="flex justify-between gap-10 items-center">
          <QuantitySelector medicineid={details.id} />

          <AddToCart
            productDetails={details}
            title="Add To Cart"
            className="bg-[#0070ba] w-full text-white sm:py-3 py-2 rounded-full cursor-pointer"
          />
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto rounded-lg bg-[#f0f8ff]  text-sm sm:mt-12 mt-7">
        {/* Delivery row */}
        <div className="flex items-start gap-4 p-4 border-b border-blue-100">
          <RiTruckLine className="w-8 h-8 mt-0.5 text-blue-900" />
          <div>
            <p className="font-semibold text-blue-950">
              Delivery by 20 July, 25
            </p>
            <a href="#" className="underline text-xs mt-2">
              Enter your postal code for Delivery Availability
            </a>
          </div>
        </div>

        {/* Return row */}
        <div className="flex items-start gap-4 p-4">
          <RiArrowGoBackLine className="w-8 h-8 mt-0.5 text-blue-900" />
          <div>
            <p className="font-semibold text-blue-950">Return Delivery</p>
            <p className="text-gray-600 text-xs">
              Free 30 Days Delivery Returns.{" "}
              <a href="#" className="underline">
                Details
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDeatilsCard;
