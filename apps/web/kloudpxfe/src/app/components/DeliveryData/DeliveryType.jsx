"use client";

import { useCheckout } from "@/app/contexts/CheckoutContext";
import React, { useEffect } from "react";

const DeliveryType = ({ setDeliverySuccess }) => {
  const { selected, setSelected, addDeliveryData } = useCheckout();

  const handleContinueToPay = async () => {
    try {
      await addDeliveryData();
      setDeliverySuccess(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="mt-10">
      {/* Priority Delivery */}
      <label
        htmlFor="priority"
        className={`flex justify-between items-center py-5 px-6 rounded-xl cursor-pointer border ${
          selected === "priority"
            ? "bg-[#EDF4F6] border-[#0070BA]"
            : "bg-[#EDF4F6] border-transparent"
        } mb-4 transition-all`}
      >
        <div className="flex items-center gap-4">
          <input
            type="radio"
            id="priority"
            name="delivery"
            value="priority"
            checked={selected === "priority"}
            onChange={() => setSelected("priority")}
            className="accent-[#0070BA] mt-1 w-5 h-5"
          />
          <div>
            <h3 className="font-medium tracking-wide text-base text-[#00243f]">
              On-Demand Delivery
            </h3>
            <span className="text-xs tracking-wide text-gray-600">
              Get your medicines delivered on the same day.
            </span>
          </div>
        </div>
        {/* <span className="text-[#00243f] font-medium text-lg">₱20</span> */}
      </label>

      {/* Standard Delivery */}
      <label
        htmlFor="standard"
        className={`flex justify-between items-center py-5 px-6 rounded-xl cursor-pointer border ${
          selected === "standard"
            ? "bg-[#EDF4F6] border-[#0070BA]"
            : "bg-[#EDF4F6] border-transparent"
        } mb-4 transition-all`}
      >
        <div className="flex items-center gap-4">
          <input
            type="radio"
            id="standard"
            name="delivery"
            value="standard"
            checked={selected === "standard"}
            onChange={() => setSelected("standard")}
            className="accent-[#0070BA] mt-1 w-5 h-5"
          />
          <div>
            <h3 className="font-medium tracking-wide text-base text-[#00243f]">
              Standard Delivery
            </h3>
            <span className="text-xs tracking-wide text-gray-600">
              Get your medicines delivered next day.
            </span>
          </div>
        </div>
        {/* <span className="text-[#00243f] font-medium text-lg">₱0</span> */}
      </label>

      {/* Cash on Delivery */}
      <label
        htmlFor="cod"
        className={`flex justify-between items-center py-5 px-6 rounded-xl cursor-pointer border ${
          selected === "cod"
            ? "bg-[#EDF4F6] border-[#0070BA]"
            : "bg-[#EDF4F6] border-transparent"
        } mb-4 transition-all`}
      >
        <div className="flex items-center gap-4">
          <input
            type="radio"
            id="cod"
            name="delivery"
            value="cod"
            checked={selected === "cod"}
            onChange={() => setSelected("cod")}
            className="accent-[#0070BA] mt-1 w-5 h-5"
          />
          <div>
            <h3 className="font-medium tracking-wide text-base text-[#00243f]">
              Cash on Delivery (COD)
            </h3>
            <span className="text-xs tracking-wide text-gray-600">
              Pay with cash when your order is delivered.
            </span>
          </div>
        </div>
        {/* <span className="text-[#00243f] font-medium text-lg">₱0</span> */}
      </label>

      {/* Continue to Pay */}
      <div className="pt-8">
        <button
          type="button"
          onClick={handleContinueToPay}
          className="bg-[#0070BA] text-white cursor-pointer w-full py-3 text-sm rounded-full font-medium hover:bg-[#005c96]"
        >
          Continue to Pay
        </button>
      </div>
    </div>
  );
};

export default DeliveryType;
