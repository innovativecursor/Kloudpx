"use client";
import React from "react";
import { motion } from "framer-motion";

const Video = () => {
  // Variants for animation
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="responsive-mx lg:mt-28 lg:py-14 sm:py-8 py-6 md:mt-20 sm:mt-16 mt-11 bg-[#EBF7FF] border border-gray-100 flex flex-col justify-center items-center rounded-xl"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }} // triggers animation when 30% of component is in view
    >
      <motion.h1
        className="font-bold sm:text-2xl text-lg tracking-wide lg:pt-8 md:pt-5"
        variants={itemVariants}
      >
        How Kloud P&X Works
      </motion.h1>

      <motion.p
        className="font-normal opacity-80 sm:mt-2 text-center sm:text-[12px] text-color text-[7px] md:text-sm"
        variants={itemVariants}
      >
        Learn how easy it is to get your medicines delivered safely and quickly.
      </motion.p>

      <motion.video
        src="/video.webm"
        className="lg:w-[60%] md:w-[70%] w-[90%] h-auto lg:mt-7 mt-3 rounded-xl"
        autoPlay
        loop
        playsInline
        controls
        muted
        variants={itemVariants}
      />

      <motion.p
        className="font-light mt-2 sm:text-[12px] dark-text text-[7px] md:text-base"
        variants={itemVariants}
      >
        Watch our 1-minute video on how to order medicines.
      </motion.p>
    </motion.div>
  );
};

export default Video;
