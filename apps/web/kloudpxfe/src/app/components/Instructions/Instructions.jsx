"use client";
import React from "react";
import { BiClipboard } from "react-icons/bi";
import { BsCartCheck } from "react-icons/bs";
import { AiOutlineCreditCard } from "react-icons/ai";
import { FiTruck } from "react-icons/fi";
import Image from "next/image";
import image from "@/assets/imagw.png";

const Instructions = () => {
  return (
    <>
      <div className="responsive-mx  md:py-8 py-5 bg-[#F9FCFF] sm:px-0 px-2  border border-gray-200 rounded-2xl sm:shadow-lg shadow lg:mt-20 sm:mt-16 mt-12">
        <h2 className="text-center font-semibold sm:text-lg text-base md:text-2xl mt-4 mb-8">
          Instructions on how to order
        </h2>

        {/* Grid container */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:gap-8 gap-6 justify-items-center">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="sm:p-3 rounded-full text-blue-600">
              <BiClipboard size={28} />
            </div>
            <p className="font-medium sm:mt-2 mt-1">Step 1</p>
            <p className="text-gray-600 sm:text-xs text-[10px]">
              Upload your prescription
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-2 ">
            <div className="sm:p-3 rounded-full text-green-600">
              <BsCartCheck size={28} />
            </div>
            <p className="font-medium sm:mt-2 mt-1">Step 2</p>
            <p className="text-gray-600 sm:text-xs text-[10px]">
              Add items to your cart
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-2 ">
            <div className="sm:p-3 rounded-full text-blue-600">
              <AiOutlineCreditCard size={28} />
            </div>
            <p className="font-medium sm:mt-2 mt-1">Step 3</p>
            <p className="text-gray-600 sm:text-xs text-[10px]">
              Show QR code when you have to pay
            </p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center space-y-2 ">
            <div className="sm:p-3 rounded-full text-purple-600">
              <FiTruck size={28} />
            </div>
            <p className="font-medium sm:mt-2 mt-1">Step 4</p>
            <p className="text-gray-600 sm:text-xs text-[10px]">
              Get your order delivered
            </p>
          </div>
        </div>
      </div>

      <div className="lg:mt-20 md:mt-14 sm:mt-14 mt-11">
        <Image src={image} alt="image" className="w-full h-auto" priority />
      </div>
    </>
  );
};

export default Instructions;
