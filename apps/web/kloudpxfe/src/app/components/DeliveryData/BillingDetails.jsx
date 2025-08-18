"use client";

import React from "react";
import { AiFillProduct } from "react-icons/ai";
import { MdDeliveryDining, MdLocalOffer, MdPayment } from "react-icons/md";
import { CiDeliveryTruck } from "react-icons/ci";
// import { useCartContext } from "@/app/contexts/CartContext";

const BillingDetails = ({ deliveryData }) => {
  // const { removeFromCart } = useCartContext();
  if (!deliveryData) return null;

  const fallbackImage = "/assets/fallback.png";

  // const handleDelete = (id) => {
  //   removeFromCart(id);
  // };

  console.log(deliveryData);

  return (
    <div className="mt-4">
      {/* Cart Items */}
      {deliveryData.cart_items?.map((item, index) => {
        const medicine = item.medicine || {};
        const image = medicine?.images?.[0] || fallbackImage;

        const price = medicine?.price || 0;
        const discountPercent =
          parseFloat(medicine?.discount?.replace("%", "")) || 0;
        const discountedPrice = (
          price -
          (price * discountPercent) / 100
        ).toFixed(2);

        return (
          <div
            key={index}
            className="flex items-center gap-4 md:py-4 px-6 border-b border-gray-200"
          >
            <div>
              <img
                src={image}
                alt={medicine.generic_name || "Product"}
                className="w-16 h-16 object-cover rounded-md"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-sm font-medium text-[#0070ba]">
                {medicine.generic_name || "Generic Name"}
              </h1>
              <h4 className="font-light text-sm mb-1">
                {medicine.brand_name || "Brand Name"}
              </h4>
              <div className="text-base mt-1 font-medium text-[#333]">
                {discountPercent > 0 ? (
                  <div className="text-sm font-semibold text-[#333]">
                    ₱{discountedPrice}
                    <span className="text-xs line-through text-gray-400 ml-2">
                      ₱{price}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-semibold text-[#333]">
                    ₱{price}
                  </span>
                )}
              </div>
              <span className="text-xs">Quantity: {item.quantity || 0}</span>
            </div>

            {/* Delete Button */}
            {/* <button
              onClick={() => handleDelete(item.cart_id)}
              className="cursor-pointer font-light text-gray-400"
              title="Remove"
            >
              <i className="ri-close-circle-line text-2xl font-light"></i>
            </button> */}
          </div>
        );
      })}

      {/* Delivery Details */}
      <div className="mt-4 px-6 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <AiFillProduct className="text-base" />
            <span className="text-sm font-medium">Total Price</span>
          </div>
          <span className="text-sm font-semibold text-[#333]">
            ₱{deliveryData.total_price?.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <MdDeliveryDining className="text-base" />
            <span className="text-sm font-medium">Delivery Type</span>
          </div>
          <span className="text-sm font-semibold text-[#333]">
            {deliveryData.delivery_type}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <MdLocalOffer className="text-base" />
            <span className="text-sm font-medium">Delivery Cost</span>
          </div>
          <span className="text-sm font-semibold text-[#333]">
            ₱{deliveryData.delivery_cost?.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <MdPayment className="text-base" />
            <span className="text-sm font-medium">COD Cost</span>
          </div>
          <span className="text-sm font-semibold text-[#333]">
            ₱{deliveryData.cod_fee?.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <CiDeliveryTruck className="text-base" />
            <span className="text-sm font-medium">Delivery Time</span>
          </div>
          <span className="text-sm font-semibold text-[#333]">
            {deliveryData.delivery_time}
          </span>
        </div>

        {/* Total Amount */}
        <div className="w-full h-[0.5px] bg-[#0070ba] mt-4"></div>
        <div className="flex justify-between items-center py-3">
          <span className="text-sm font-semibold">Total Amount</span>
          <span className="text-sm font-semibold text-[#333]">
            ₱{deliveryData.grand_total?.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BillingDetails;
