"use client";

import { useCheckout } from "@/app/contexts/CheckoutContext";
import React, { useEffect, useState } from "react";
import { FaPaperclip } from "react-icons/fa";
import Qr from "./Qr";
import { usePayment } from "@/app/contexts/PaymentContext";

const Screener = () => {
  const { deliveryData } = useCheckout();
  const {
    handleFileChange,
    selectedFile,
    gcashNumber,
    setGcashNumber,
    amountPaid,
    setAmountPaid,
    handleSubmit,
    getPaymentSlip,
    paymentSlip,
    previewImage,
  } = usePayment();

  useEffect(() => {}, [deliveryData]);

  // useEffect(() => {
  //   getPaymentSlip();
  // }, []);

  // console.log(paymentSlip);

  return (
    <div className="w-full mt-10 py-8 px-6 bg-[#EDF4F6] rounded-lg ">
      <div className="">
        <Qr deliveryData={deliveryData} />

        <div className="flex justify-between sm:flex-row flex-col items-center mt-12 mb-4">
          <div className=" sm:w-[45%] w-full">
            <label
              htmlFor="upload"
              className="bg-[#0070BA] hover:bg-[#005c96] cursor-pointer text-white flex items-center justify-center gap-2 
              text-sm lg:py-3 py-2 px-5 rounded-full w-full mb-4"
            >
              <FaPaperclip className="text-xs" />
              <span className="lg:text-xs text-[11px]">
                Upload Gcash Payment
              </span>
              <input
                type="file"
                id="upload"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </label>
            <h2 className="text-center text-sm text-gray-500 mb-4">or</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Provide Gcash Payment Number"
                value={gcashNumber}
                onChange={(e) => setGcashNumber(e.target.value)}
                className="w-full border-b border-[#00243f] bg-transparent text-sm py-2 px-1 outline-none placeholder:text-[#00243f]"
              />
            </div>
          </div>

          <div className=" sm:w-[45%] w-full sm:mt-0 mt-10">
            <div className="w-full">
              <h1 className="font-medium text-sm mb-1 text-[#00243f]">
                Preview
              </h1>
              <div className="rounded-md overflow-hidden shadow">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                    No file selected
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <input
          type="number"
          placeholder="please enter remark"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          className="w-full border-b border-[#00243f] bg-transparent text-sm py-2 px-1 outline-none placeholder:text-[#00243f]"
        />
      </div>

      <div className="flex justify-center items-center  w-full sm:mt-10 mt-6 text-xs">
        <button
          onClick={handleSubmit}
          className="bg-[#0070ba] text-white py-3 cursor-pointer px-12 rounded-full"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Screener;
