"use client";
import React from "react";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";

import aboutbanner from "@/assets/aboutbanner.png";
import banner1 from "@/assets/aboutb1.png";
import aboutcore from "@/assets/aboutcore.png";
import team from "@/assets/team.png";

import pharmacy from "@/assets/pharmacy-store.png";
import pharmacy1 from "@/assets/Rectangle 4756.png";
import WhyChooseUs from "../components/WhyChooseUs/WhyChooseUs";

const Page = () => {
  return (
    <div className="pb-10 min-h-screen md:mt-62 sm:mt-48 mt-32">
      {/* Top Banner */}
      <Image
        src={aboutbanner}
        alt="about banner"
        className="w-full h-auto object-cover"
        priority
      />

      {/* About Section */}
      <div className="responsive-mx grid grid-cols-1 md:grid-cols-2 gap-10 items-center  sm:px-6 md:px-8">
        <div className="mt-8 md:mt-12">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4">
            Committed to Your Health & Well-Being
          </h2>
          <p className="text-gray-600 leading-relaxed mt-3 text-xs sm:text-sm text-start">
            At Kloud P&X, we are dedicated to providing safe, reliable, and
            convenient access to high-quality medications and wellness products.
            As a trusted online pharmacy, we combine professional expertise,
            affordability, and discreet service to ensure your healthcare needs
            are met with confidence.
          </p>
          <p className="text-gray-600 leading-relaxed mt-5 text-xs sm:text-sm text-start">
            Backed by a team of licensed pharmacists and healthcare
            professionals, we guarantee that every product we offer meets
            stringent quality and safety standards. Whether you require
            prescription medications, over-the-counter remedies, or premium
            wellness supplements, Kloud P&X delivers authentic, FDA-approved
            products right to your doorstep.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <Image
            src={pharmacy}
            alt="pharmacy store"
            className="w-full max-w-sm sm:max-w-md md:max-w-lg object-contain -mt-8 md:-mt-40"
          />
        </div>
      </div>

      {/* Mission Section */}
      <div className="responsive-mx sm:px-10 md:px-20 py-10 mt-10 md:mt-20">
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="relative">
            <Image
              src={pharmacy1}
              alt="pharmacy staff"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 sm:p-6 bg-blue-50">
            <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4">
              Our Mission & Vision
            </h3>
            <ul className="space-y-3 text-gray-700">
              {[...Array(4)].map((_, i) => (
                <li key={i} className="flex items-start gap-3">
                  <FaCheckCircle className="text-blue-600 mt-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">
                    To be one of the top on-line retailers that provides
                    quality, effective, and safe medicines, food, cosmetics and
                    consumer goods, providing availability for both branded and
                    generic products, in the country.
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="my-6 sm:my-10">
        <Image
          src={banner1}
          alt="about banner"
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      {/* Core Values */}
      <div className="py-10 md:py-12">
        <div className="responsive-mx  text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 sm:mb-11">
            Our Core Values
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-[#EDF4F6] rounded-xl shadow-md overflow-hidden"
              >
                <Image
                  src={aboutcore}
                  alt="value"
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">
                    Quality & Safety
                  </h4>
                  <p className="text-xs sm:text-sm px-2 sm:px-8 text-gray-600">
                    We never compromise on the quality and safety of our
                    products.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-[#006EBB] py-10 sm:py-12 mt-10 sm:mt-16">
        <h3 className="text-2xl sm:text-3xl font-semibold text-center text-white mb-8 sm:mb-11">
          Meet Our Team
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 responsive-mx px-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-center">
              <Image
                src={team}
                alt="team member"
                className="w-full max-w-[280px] sm:max-w-[320px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <WhyChooseUs />
    </div>
  );
};

export default Page;
