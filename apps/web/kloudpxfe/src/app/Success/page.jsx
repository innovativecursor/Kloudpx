"use client";

import React from "react";
import { useRouter } from "next/navigation";

const SuccessPage = () => {
  const router = useRouter();

  const handleBackToShopping = () => {
    router.push("/");
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4 md:mt-52 sm:mt-48 mt-32">
      <h1 className="sm:text-3xl text-2xl font-bold text-green-600 mb-4">
        Your Order Has Been Placed Successfully!
      </h1>
      <p className="sm:text-lg text-sm text-gray-700 max-w-md mb-6">
        You will receive the tracking ID via email or SMS shortly. Thank you for
        shopping with us.
      </p>
      <button
        onClick={handleBackToShopping}
        className="px-6 py-2 bg-[#0070ba] cursor-pointer text-white rounded-lg hover:bg-[#0070ba]/90 transition"
      >
        Back to Shopping
      </button>
    </div>
  );
};

export default SuccessPage;
