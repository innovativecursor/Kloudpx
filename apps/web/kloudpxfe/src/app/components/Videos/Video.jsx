"use client";
import React from "react";
import Image from "next/image";
import ordervideo from "@/assets/ordervideo.webp";

const Video = () => {
  return (
    <div className="responsive-mx lg:mt-28 lg:py-14 sm:py-8 py-6  md:mt-20 sm:mt-16 mt-11 bg-[#EBF7FF] border border-gray-100 flex flex-col justify-center items-center rounded-xl">
      <h1 className="font-bold sm:text-2xl text-lg tracking-wide lg:pt-8 md:pt-5 ">
        How Kloud P&X Works
      </h1>
      <p className="font-normal opacity-80 sm:mt-2 text-center sm:text-[12px] text-color text-[7px] md:text-sm">
        Learn how easy it to get your medicines delivered safely and quickly.
      </p>
      <Image
        src={ordervideo}
        alt="video"
        className="lg:w-[60%] md:w-[70%] w-[80%] h-auto lg:mt-7 mt-3 rounded-xl"
        priority
      />
      <p className="font-light mt-2 sm:text-[12px] dark-text text-[7px] md:text-base">
        Watch our 1-minute video how to order medicines.
      </p>
    </div>
  );
};

export default Video;
