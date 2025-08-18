"use client";

import React, { useEffect } from "react";
import { useCheckout } from "@/app/contexts/CheckoutContext";
import { usePayment } from "@/app/contexts/PaymentContext";

const DeliveryType = () => {
  const {
    selected,
    setSelected,
    addDeliveryData,
    selectedId,
    deliveryData,
    paymentMethod,
    setPaymentMethod,
    setDeliveryData,
  } = useCheckout();

  const { handleOrderSubmit } = usePayment();

  useEffect(() => {
    setDeliveryData(null);
  }, []);

  useEffect(() => {
    if (selectedId) {
      addDeliveryData();
    }
  }, [selectedId]);

  useEffect(() => {
    if (!selected) setSelected("standard");
  }, [selected, setSelected]);

  return (
    <div className="mt-10">
      {/* Delivery Type */}
      <label
        htmlFor="standard"
        className={`flex justify-between items-center py-5 px-6 rounded-xl cursor-pointer border ${
          selected === "standard"
            ? "bg-[#EDF4F6] border-[#0070BA]"
            : "bg-[#EDF4F6] border-transparent"
        } mb-6 transition-all`}
      >
        <div className="flex items-center gap-4">
          <input
            type="radio"
            id="standard"
            name="delivery"
            value="standard"
            checked={selected === "standard"}
            onChange={() => {
              setSelected("standard");
              addDeliveryData();
            }}
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
      </label>

      {/* Payment Type */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">
          Select Payment Type
        </h4>
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="paymentType"
              value="GCOD"
              checked={paymentMethod === "GCOD"}
              onChange={() => setPaymentMethod("GCOD")}
              className="accent-[#0070BA] w-5 h-5"
            />
            <span className="text-gray-800 font-medium">
              GCOD (Gcash on COD)
            </span>
          </label>
        </div>
      </div>

      {/* Continue Button */}
      <div className="pt-8">
        <button
          type="button"
          onClick={handleOrderSubmit}
          className="bg-[#0070BA] text-white cursor-pointer w-full py-3 text-sm rounded-full font-medium hover:bg-[#005c96]"
        >
          Continue to Pay
        </button>
      </div>
    </div>
  );
};

export default DeliveryType;
