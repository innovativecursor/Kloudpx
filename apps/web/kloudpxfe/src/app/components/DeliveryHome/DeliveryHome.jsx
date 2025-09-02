"use client";
import React from "react";
import Image from "next/image";
import { FaUserTie, FaTruck } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import delivery1 from "@/assets/delivery1.png";
import delivery2 from "@/assets/delivery2.png";

const DeliveryHome = () => {
  return (
    <div className="responsive-mx lg:mt-36 md:mt-28 mt-14">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-10 lg:items-center md:items-start items-center">
        {/* Image */}
        <div className="">
          <Image
            src={delivery1}
            alt="Delivery Service"
            className="w-full h-auto rounded-2xl"
            priority
          />
        </div>

        {/* Text */}
        <div>
          <h2 className="lg:text-5xl md:text-3xl text-2xl font-semibold lg:mb-6 mb-4">
            100% Authentic Medicines
          </h2>
          <p className="text-gray-500 text-start tracking-wide  leading-relaxed lg:text-lg text-sm   ">
            Our licensed pharmacists are available to provide personalized
            advice and answer your questions about medications, potential
            interactions, and side answer your questions about medications,
            potential interactions, and side effects. We ensure you have all the
            information you need for safe and effective treatment.
          </p>

          <div className="flex items-center md:space-x-6 space-x-4 lg:mt-11 mt-6">
            <img
              src="https://www.digitalstrike.com/wp-content/uploads/2018/09/testimonial-blog-post.jpg"
              className="lg:w-16 rounded-full lg:h-16 w-14 h-14 object-cover"
            />
            <div>
              <p className="font-bold md:text-lg text-base">Professional Staff</p>
              <p className="text-gray-500 md:text-base md:mt-1 text-sm">
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

              <h2 className="lg:text-5xl md:text-3xl text-2xl font-semibold lg:mb-6 mb-4  leading-snug">
                   Fast &amp; Secure Delivery Service
          </h2>
          <p className="text-gray-500 lg:text-lg md:text-start text-sm tracking-wide mb-8">
            Get your medications and health products delivered right to your
            doorstep with our reliable delivery service. We ensure your privacy
            and the integrity of your medications with temperature-controlled
            packaging and discreet delivery options.
          </p>

          {/* Same-Day Delivery */}

          <div className="flex items-center md:space-x-6 space-x-4">
            <div className="bg-[#006EBB] text-white rounded-full p-4 flex items-center text-2xl">
              <FaTruck className="lg:text-3xl " />
            </div>

            <div>
              <p className="font-bold md:text-lg text-base">Same-Day Delivery</p>
              <p className="text-gray-500 md:text-base md:mt-1 text-sm">
                For orders placed before 2 PM
              </p>
            </div>
          </div>

          {/* Secure Packaging */}

          <div className="flex items-center space-x-6 md:mt-9 mt-6">
            <div className="bg-[#006EBB] text-white rounded-full p-4 flex items-center text-2xl">
              <MdOutlineSecurity className="lg:text-3xl" />
            </div>

            <div>
              <p className="font-bold md:text-lg text-base">Secure Packaging</p>
              <p className="text-gray-500 md:text-base md:mt-1 text-sm">
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
