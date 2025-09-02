"use client";
import React from "react";
import { motion } from "framer-motion";
import { BiClipboard } from "react-icons/bi";
import { BsCartCheck } from "react-icons/bs";
import { FiFileText } from "react-icons/fi";
import { MdDeliveryDining } from "react-icons/md";
import { AiOutlineCreditCard } from "react-icons/ai";
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

  const steps = [
    {
      icon: <BiClipboard size={28} />,
      title: "Step 1",
      desc: "Upload your prescription",
      color: "#2563EB",
    },
    {
      icon: <BsCartCheck size={28} />,
      title: "Step 2",
      desc: "Add items to your cart",
      color: "#16A34A",
    },
    {
      icon: <FiFileText size={28} />,
      title: "Step 3",
      desc: "Enter contact number & delivery address",
      color: "#9333EA",
    },
    {
      icon: <MdDeliveryDining size={28} />,
      title: "Step 4",
      desc: "Get your order delivered",
      color: "#EC4899",
    },
    {
      icon: <AiOutlineCreditCard size={28} />,
      title: "Step 5",
      desc: "Pay by GCOD/COD on delivery",
      color: "#006EBB",
    },
  ];

  return (
    <>
      <div className="responsive-mx lg:px-8 relative overflow-hidden  md:mt-28 mt-14 bg-[#F9FCFF]  border-2 border-gray-100 rounded-2xl sm:shadow-md shadow ">
        <h2 className="text-center font-medium sm:text-lg text-base md:text-3xl tracking-wide mt-6 md:mb-12 mb-9">
          Instructions on how to order
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 mb-8 gap-10 items-center relative z-10">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.3, type: "spring", stiffness: 120 }}
              whileHover={{ scale: 1.2, y: -10 }}
              className="flex flex-col items-center text-center cursor-pointer"
            >
              <div
                style={{ backgroundColor: step.color }} // use hex color here
                className="p-5 rounded-full shadow-xl flex items-center text-white justify-center ring-2 ring-white hover:shadow-2xl"
              >
                {step.icon}
              </div>

              <p className="font-medium mt-4 text-base">{step.title}</p>
              <p className="text-gray-500 text-xs mt-1 max-w-xs">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white  md:mt-24 mt-12 ">
        <section className="responsive-mx sm:py-16 py-7">
          <div className="grid grid-cols-3 sm:gap-8 gap-5 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center justify-start cursor-pointer"
              >
                <div className="h-16 sm:h-full">
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
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Instructions;
