




"use client";
import React from "react";
import { motion } from "framer-motion";
import { BiClipboard } from "react-icons/bi";
import { BsCartCheck } from "react-icons/bs";
import { FiFileText } from "react-icons/fi";
import { MdDeliveryDining } from "react-icons/md";
import { AiOutlineCreditCard } from "react-icons/ai";

const Instructions = () => {
  const steps = [
    {
      icon: <BiClipboard size={40} />,
      title: "step 1",
      desc: "Upload your prescription",
    },
    {
      icon: <BsCartCheck size={40} />,
      title: "step 2",
      desc: "Add items to your cart",
    },
    {
      icon: <MdDeliveryDining size={40} />,
      title: "step 3",
      desc: "Get your order delivered",
    },
    {
      icon: <FiFileText size={40} />,
      title: "step 4",
      desc: "Enter contact number & delivery address",
    },
    {
      icon: <AiOutlineCreditCard size={40} />,
      title: "step 5",
      desc: "Pay by GCOD/COD on delivery",
    },
  ];

  return (
    <>
      <div className="responsive-mx lg:px-8 relative overflow-hidden md:mt-28 mt-14 bg-white border-2 border-gray-100 rounded-2xl sm:shadow-md shadow py-10">
        {/* Heading */}
        <h2 className="text-center font-bold sm:text-lg text-base md:text-3xl tracking-wide mb-12">
          Instructions on how to{" "}
          <span className="text-blue-600">order</span>
        </h2>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-center relative z-10">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.3, type: "spring", stiffness: 120 }}
              whileHover={{ scale: 1.1, y: -8 }}
              className="flex flex-col items-center text-center cursor-pointer"
            >
              <div className="text-black">{step.icon}</div>
              <p className="font-semibold mt-4 text-sm md:text-base text-blue-200 uppercase">
                {step.title}
              </p>
              <p className="text-gray-700 text-sm md:text-base mt-2 max-w-xs">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Instructions;
