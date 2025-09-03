"use client";

import React, { useEffect } from "react";
import { useCheckout } from "@/app/contexts/CheckoutContext";
import { usePayment } from "@/app/contexts/PaymentContext";
import toast from "react-hot-toast";
import { FaTruckFast } from "react-icons/fa6";
import { MdPayment } from "react-icons/md";

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
    checkoutData,
  } = useCheckout();

  const { handleOrderSubmit } = usePayment();

  const checkoutsessionid = checkoutData?.checkout_session_id;

  useEffect(() => {
    addDeliveryData();
  }, [selectedId, selected, checkoutsessionid]);

  useEffect(() => {
    if (!selected) setSelected("standard");
  }, [selected, setSelected]);

  return (
    <div className="mt-7 ">
      {/* Delivery Type Header */}
      <div className="flex items-center gap-4 mb-6 text-gray-800">
        <FaTruckFast className="text-4xl text-[#0070BA]" />
        <span className="font-medium text-2xl">Select Delivery Type</span>
      </div>

      {/* Delivery Type Card */}
      <label
        htmlFor="standard"
        className={`flex justify-between items-center py-5 px-6 rounded-2xl cursor-pointer border transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1 ${
          selected === "standard"
            ? "bg-gradient-to-r from-[#D9F0FF] to-[#E0F8FF] border-[#0070BA]"
            : "bg-white border-gray-200"
        } mb-6`}
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
            className="accent-[#0070BA] w-6 h-6 mt-0.5"
          />
          <div>
            <h3 className="font-semibold tracking-wide text-lg text-[#00243f]">
              Standard Delivery
            </h3>
            <span className="text-sm text-gray-600">
              Get your medicines delivered next day.
            </span>
          </div>
        </div>
      </label>

      {/* Payment Type Header */}
      <div className="flex items-center gap-4 mb-6 text-gray-800 pt-5">
        <MdPayment className="text-4xl text-[#0070BA]" />
        <h4 className="font-medium text-lg">Select Payment Type</h4>
      </div>

      {/* Payment Type Card */}
      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-3 cursor-pointer py-6 px-5 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all bg-white">
          <input
            type="radio"
            name="paymentType"
            value="GCOD"
            checked={paymentMethod === "GCOD"}
            onChange={() => setPaymentMethod("GCOD")}
            className="accent-[#0070BA] w-6 h-6"
          />
          <span className="text-gray-800 font-medium text-base">
            GCOD (G-Cash upon Delivery)
          </span>
        </label>
      </div>

      {/* Continue Button */}
      <div className="pt-10">
        <button
          type="button"
          onClick={() => {
            if (
              !deliveryData?.cart_items ||
              deliveryData?.cart_items.length === 0
            ) {
              toast.error("No items in checkout. Add items first!");
              return;
            }
            handleOrderSubmit();
          }}
          className="bg-gradient-to-r from-[#0070BA] to-[#005c96] text-white w-full py-3 text-sm rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Continue to Pay
        </button>
      </div>
    </div>
  );
};

export default DeliveryType;
