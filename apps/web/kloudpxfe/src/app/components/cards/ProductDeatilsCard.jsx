import React from "react";
import QuantitySelector from "../QuantitySelector/QuantitySelector";
import AddToCart from "../button/AddToCart";
import SocialIcons from "../SocialIcons/SocialIcons";

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
    <div>
      <div className="">
        <div className="flex items-start gap-8 mb-2">
          <h2 className="text-xl font-light text-color ">
            {details?.genericname || "General Medicine"}
          </h2>
          {/* <SocialIcons /> */}
        </div>
        <div className="flex items-start gap-8">
          <h1 className="text-4xl font-bold mb-2">
            {details?.brandname} {details?.power}
          </h1>
          <SocialIcons />
        </div>
        <div className="flex items-center  gap-3 mb-2 mt-4">
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
                  {details?.discount}%
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

        <p className="opacity-60 leading-relaxed items-start mb-6 mt-5 text-sm md:text-lg text-justify">
          {details?.description || "No description available."}
        </p>

        <div className="flex justify-between gap-10 items-center">
          <QuantitySelector medicineid={details.id} />

          <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
            {/* <button
                className="w-full sm:flex-1 flex items-center justify-center gap-3 bg-[#0070ba] hover:to-blue-600 text-white font-semibold text-base px-8 py-3 rounded-full cursor-pointer shadow-lg transition-transform transform hover:scale-105 active:scale-95"
                onClick={handleAddToCartClick}
              >
                <i className="ri-shopping-cart-line text-xl"></i>
                Add to Cart
              </button> */}
            <AddToCart productDetails={details} title="Add To Cart" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDeatilsCard;
