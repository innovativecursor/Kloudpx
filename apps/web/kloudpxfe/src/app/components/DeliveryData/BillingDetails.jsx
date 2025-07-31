import React from "react";
import { AiFillProduct } from "react-icons/ai";
import { MdDeliveryDining } from "react-icons/md";
import { MdLocalOffer } from "react-icons/md";
import { MdPayment } from "react-icons/md";

const BillingDetails = ({ deliveryData }) => {
  if (!deliveryData) return null;

  return (
    <div>
      <div className="w-full h-[0.5px] mt-7 bg-[#0070ba]"></div>
      <div>
        <div className="flex  font-semibold text-black px-6 pt-8 items-center text-base ">
          Billing Details
        </div>

        <div className="flex justify-between items-center px-6 mt-3">
          <div className="flex gap-1  items-center">
            <AiFillProduct className="text-xs" />
            <span className="text-sm font-medium">Item</span>
          </div>
          <span className="text-sm font-semibold text-[#333]">
            ₱{deliveryData?.total_price?.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center px-6 mt-3">
          <div className="flex gap-1  items-center">
            <MdDeliveryDining className="text-base" />
            <span className="text-sm font-medium">Delivery Type</span>
          </div>
          <span className="text-sm font-semibold text-[#333]">
            {deliveryData?.delivery_type}
          </span>
        </div>

        <div className="flex justify-between items-center px-6 mt-3">
          <div className="flex gap-1  items-center">
            <MdLocalOffer className="text-base" />
            <span className="text-sm font-medium">Delivery Cost</span>
          </div>
          <span className="text-sm font-semibold text-[#333]">
            {deliveryData?.delivery_cost?.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center px-6 mt-3">
          <div className="flex gap-1  items-center">
            <MdPayment className="text-base" />
            <span className="text-sm font-medium">COD Cost</span>
          </div>
          <span className="text-sm font-semibold text-[#333]">
            {deliveryData?.cod_fee?.toFixed(2)}
          </span>
        </div>

        <div className="w-full h-[0.5px] mt-7 bg-[#0070ba]"></div>
        <div className="flex justify-between pb-5 items-center px-6 mt-3">
          <span className="text-sm font-semibold">Total Amount</span>
          <span className="text-sm font-semibold text-[#333]">
            ₱{deliveryData?.grand_total?.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BillingDetails;
