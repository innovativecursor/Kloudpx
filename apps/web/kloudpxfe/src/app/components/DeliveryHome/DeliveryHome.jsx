"use client";
import React from "react";
import Image from "next/image";
import { FaUserTie, FaTruck } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import delivery1 from "@/assets/delivery1.png";
import delivery2 from "@/assets/delivery2.png";

const DeliveryHome = () => {
  return (
    <div className="responsive-mx lg:mt-28 md:mt-24 sm:mt-16 mt-14">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-28 gap-10 lg:items-center md:items-start items-center">
        {/* Image */}
        <div className="">
          <Image
            src={delivery1}
            alt="Delivery Service"
            className="w-full md:h-96 h-auto rounded-xl"
            priority
          />
        </div>

        {/* Text */}
        <div>
          <h2 className="sm:text-2xl text-xl font-bold mb-4">
            100% Authentic Medicines
          </h2>
          <p className="text-gray-600 text-justify md:text-start tracking-wide mb-6">
            Our licensed pharmacists are available to provide personalized
            advice and answer your questions about medications, potential
            interactions, and side effects. We ensure you have all the
            information you need for safe and effective treatment.
          </p>

          <div className="flex items-start space-x-6">
            <div className="text-[#0070ba] bg-blue-100 rounded-full p-4 flex items-center text-2xl">
              <FaUserTie />
            </div>
            <div>
              <p className="font-bold tex-base">Professional Staff</p>
              <p className="text-gray-500 text-sm">
                Trained and certified pharmacists
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-32 gap-10  md:items-start items-center lg:mt-28 md:mt-20 sm:mt-16 mt-11">
        {/* Text */}
        <div>
          <h2 className="sm:text-2xl text-xl font-bold mb-6">
            Fast &amp; Secure Delivery Service
          </h2>
          <p className="text-gray-600 text-justify md:text-start tracking-wide mb-8">
            Get your medications and health products delivered right to your
            doorstep with our reliable delivery service. We ensure your privacy
            and the integrity of your medications with temperature-controlled
            packaging and discreet delivery options.
          </p>

          {/* Same-Day Delivery */}

          <div className="flex items-start space-x-6">
            <div className="text-[#0070ba] bg-blue-100 rounded-full p-4 flex items-center text-2xl">
              <FaTruck />
            </div>
            <div>
              <p className="font-bold tex-base">Same-Day Delivery</p>
              <p className="text-gray-500 text-sm">
                For orders placed before 2 PM
              </p>
            </div>
          </div>

          {/* Secure Packaging */}

          <div className="flex items-start space-x-6 mt-6">
            <div className="text-[#0070ba] bg-blue-100 rounded-full p-4 flex items-center text-2xl">
              <MdOutlineSecurity />
            </div>
            <div>
              <p className="font-bold tex-base">Secure Packaging</p>
              <p className="text-gray-500 text-sm">
                Temperature-controlled and tamper-evident
              </p>
            </div>
          </div>
        </div>

        {/* Image */}
        <div>
          <Image
            src={delivery2}
            alt="Delivery Service"
            className="w-full md:h-96 h-auto rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryHome;
