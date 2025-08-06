"use client";

import { usePayment } from "@/app/contexts/PaymentContext";
import React from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Cod = () => {
  const { handleSubmit } = usePayment();
  const router = useRouter();

  return (
    <div className="bg-white border border-[#0070BA] rounded-2xl shadow-lg max-w-md mx-auto mt-12 p-8">
      {/* Icon */}
      <div className="flex justify-center items-center mb-4">
        <FaMoneyBillWave className="text-[#0070BA] text-4xl" />
      </div>

      {/* Heading */}
      <h2 className="text-center text-xl font-semibold text-[#00243f]">
        Confirm Cash on Delivery (COD)
      </h2>

      {/* Subtext */}
      <p className="text-sm text-gray-600 text-center mt-3">
        You’ve selected{" "}
        <span className="font-medium text-[#0070BA]">Cash on Delivery</span> as
        your payment method. You’ll pay when your order arrives at your
        doorstep.
      </p>

      {/* Note Box */}
      <div className="bg-[#EDF4F6] border border-dashed border-[#0070BA] mt-5 p-4 rounded-md text-xs text-gray-700">
        <strong>Note:</strong> Please ensure someone is available to receive the
        order with the exact amount in cash.
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8 gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-1/2 py-2 text-sm rounded-full border border-gray-300 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-1/2 py-2 text-sm rounded-full bg-[#0070BA] hover:bg-[#005c96] text-white transition"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default Cod;
