"use client";
import React from "react";
import { BiClipboard } from "react-icons/bi";
import { BsCartCheck } from "react-icons/bs";
import { AiOutlineCreditCard } from "react-icons/ai";
import { FiTruck } from "react-icons/fi";
import Image from "next/image";
import icon1 from "@/assets/icon1.svg";
import icon2 from "@/assets/icon2.svg";
import icon3 from "@/assets/icon3.svg";

const Instructions = () => {
  const stats = [
    {
      icon: icon2,
      number: "1000+",
      label: "Total Orders Delivered",
    },
    {
      icon: icon1,
      number: "20000+",
      label: "Pincodes Served",
    },
    {
      icon: icon3,
      number: "9M+",
      label: "Happy Customers",
    },
  ];

  return (
    <>
      {/* Instructions Section */}
      <div className="responsive-mx md:py-6 py-5  bg-[#F9FCFF] sm:px-0 px-2 border-2 border-gray-100 rounded-2xl sm:shadow-md shadow lg:mt-20 sm:mt-16 mt-12">
        <h2 className="text-center font-semibold sm:text-lg text-base md:text-2xl mt-4 mb-8">
          Instructions on how to order
        </h2>

        <div className="grid w-full grid-cols-2 md:grid-cols-4 lg:gap-8 gap-6 px-4 sm:px-6 md:px-8">
          <div className="flex  flex-col items-center justify-start text-center space-y-2">
            <div className="sm:p-3 rounded-full text-blue-600">
              <BiClipboard size={28} />
            </div>
            <p className="font-medium sm:mt-2 mt-1">Step 1</p>
            <p className="text-gray-600 sm:text-sm text-[10px]">
              Upload your prescription
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="sm:p-3 rounded-full text-green-600">
              <BsCartCheck size={28} />
            </div>
            <p className="font-medium sm:mt-2 mt-1">Step 2</p>
            <p className="text-gray-600 sm:text-sm text-[10px]">
              Add items to your cart
            </p>
          </div>

          <div className="flex  flex-col items-center text-center space-y-2">
            <div className="sm:p-3 rounded-full text-purple-600">
              <FiTruck size={28} />
            </div>
            <p className="font-medium sm:mt-2 mt-1">Step 3</p>
            <p className="text-gray-600 sm:text-sm text-[10px]">
              Get your order delivered
            </p>
          </div>

          <div className="flex  flex-col items-center text-center space-y-2">
            <div className="sm:p-3 rounded-full text-blue-600">
              <AiOutlineCreditCard size={28} />
            </div>
            <p className="font-medium sm:mt-2 mt-1">Step 4</p>
            <div>
              <p className="text-gray-600 sm:text-sm text-[10px]">
                Pay by GCOD/COD as it
              </p>
              <p className="text-gray-600 sm:text-sm text-[10px]">
                gets delivered
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white lg:mt-28 md:mt-24 sm:mt-20 mt-12 sm:py-16 py-7 ">
        <section className="responsive-mx ">
          <div className="grid grid-cols-3 sm:gap-8 gap-5 text-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-start"
              >
                <div className=" h-16 sm:h-full">
                  <Image
                    src={stat.icon}
                    alt={stat.label}
                    className="mb-3 w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 lg:w-20 lg:h-20"
                  />
                </div>
                <h2 className="text-sm sm:text-xl md:text-2xl font-bold text-black">
                  {stat.number}
                </h2>
                <p className="text-gray-600 text-[8px] sm:text-sm mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Instructions;
