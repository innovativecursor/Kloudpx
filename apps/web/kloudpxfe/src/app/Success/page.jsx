"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePayment } from "../contexts/PaymentContext";

const SuccessPage = () => {
  const router = useRouter();
  const { orderSuccess } = usePayment();

  const handleBackToShopping = () => {
    router.push("/");
  };

  const orderNumber = orderSuccess?.order_number;

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4 md:mt-52 sm:mt-48 mt-32">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center">
          <svg
            className="w-16 h-16 text-green-500 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>

          <h1 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
            Order Placed Successfully!
          </h1>

          <p className="text-gray-700 text-sm sm:text-base mb-4">
            You will receive the tracking ID via email or SMS shortly.
          </p>

          {orderNumber && (
            <div className="bg-gray-100 p-3 rounded-md mb-4 w-full">
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="text-base font-medium text-gray-800 break-all">
                {orderNumber}
              </p>
            </div>
          )}

          <button
            onClick={handleBackToShopping}
            className="px-6 py-2 bg-[#0070ba] cursor-pointer text-white rounded-lg hover:bg-[#005fa3] transition"
          >
            Back to Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
