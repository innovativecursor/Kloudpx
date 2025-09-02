"use client";
import React from "react";
import { motion } from "framer-motion";
import { BiClipboard } from "react-icons/bi";
import { BsCartCheck } from "react-icons/bs";
import { FiFileText } from "react-icons/fi";
import { MdDeliveryDining } from "react-icons/md";
import { AiOutlineCreditCard } from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";
import Image from "next/image";
import icon1 from "@/assets/icon1.svg";
import icon2 from "@/assets/icon2.svg";
import icon3 from "@/assets/icon3.svg";

import step1 from "@/assets/step1.png";
import step2 from "@/assets/step2.png";
import step3 from "@/assets/step3.png";
import step4 from "@/assets/step4.png";
import step5 from "@/assets/step5.png";
import rightarrow from "@/assets/rightarrow.png";

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
      icon: step5,
      title: "Step 1",
      desc: "Upload your prescription",
      rightarrow: <BsArrowRight />,
      color: "#2563EB",
    },
    {
      icon: step4,
      title: "Step 2",
      desc: "Add items to your cart",
      rightarrow: <BsArrowRight />,
      color: "#16A34A",
    },
    {
      icon: step3,
      title: "Step 3",
      desc: "Get your order delivered",

      rightarrow: <BsArrowRight />,
      color: "#9333EA",
    },
    {
      icon: step2,
      title: "Step 4",
      desc: "Enter contact number & delivery address",
      rightarrow: <BsArrowRight />,
      color: "#EC4899",
    },
    {
      icon: step1,
      title: "Step 5",
      desc: "Pay by GCOD/COD on delivery",
      color: "#006EBB",
    },
  ];

  return (
    <>
      <div className="responsive-mx lg:px-8 relative overflow-hidden md:mt-28 mt-14 bg-[#F9FCFF] border-2 border-gray-100 rounded-2xl sm:shadow-md shadow">
        <div className="text-center text-base md:text-4xl tracking-wide md:pt-16 pt-10 font-bold uppercase ">
          Instructions on how to <span className="text-color">order</span>
        </div>
        <div className="grid grid-cols-2  lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 lg:gap-5 sm:gap-12 gap-5 items-start  px-2  relative z-10 md:my-20 my-9">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.3, type: "spring", stiffness: 120 }}
              whileHover={{ scale: 1.1, y: -8 }}
              className="cursor-pointer relative flex flex-col items-center"
            >
              <div className="flex  items-center justify-between">
                <div className=" flex  flex-col  items-center">
                  <p className="font-bold mb-2 text-sm md:text-2xl text-[#2996D9]/24 text-center ml-16 w-full ">
                    {step.title}
                  </p>
                  <div className="text-black ">
                    <Image
                      src={step.icon}
                      alt={step.title}
                      width="full"
                      height={60}
                    />
                  </div>

                  <p className="font-medium md:px-5  text-center tracking-wide text-sm md:text-base mt-5 ">
                    {step.desc}
                  </p>
                </div>

                <div className="text-[#000000]/24 text-5xl -mt-6 lg:block hidden ">
                  {step?.rightarrow}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white  md:mt-24 mt-8 ">
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
                    className="mb-3 w-12 h-12 sm:w-14 sm:h-14 md:w-24 md:h-24"
                  />
                </div>
                <h2 className="text-base sm:text-xl md:text-2xl font-bold text-black">
                  {stat.number}
                </h2>
                <p className="text-gray-600 text-[10px] sm:text-sm mt-1">
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
