"use client";
import React from "react";
import sale2 from "@/assets/detailspic.svg";
const ProDetailsDes = ({ details }) => {
  // console.log(details);

  return (
    <div className="responsive-mx pt-10  md:pt-16  sm:px-0 px-2 grid grid-cols-1 lg:grid-cols-3 sm:gap-16 gap-12">
      {/* LEFT: Product Description */}
      <div className="lg:col-span-2 ">
        <div className="flex flex-col mb-8">
          <h2 className="md:text-2xl text-xl font-semibold">
            Product Description
          </h2>

          <div className="w-full h-[2.5px] flex mt-2">
            <div className="w-1/5 bg-[#0070ba] bg-opacity-20 h-full"></div>
            <div className="w-4/5 bg-gray-100 h-full"></div>
          </div>
        </div>

        <div className="bg-gray-100 shadow-md sm:p-6 p-4 rounded-lg mb-7">
          <h3 className="font-semibold tracking-wider sm:text-base text-sm dark-text">
            {details.brandname}: Your daily essential for vitality and
            well-being
          </h3>
        </div>

        <p className="text-gray-700 mb-7 w-full text-justify  leading-relaxed">
          {details.description}
        </p>

        {details.benefits && (
          <>
            <h3 className="text-gray-700 leading-relaxed text-justify whitespace-pre-line w-full lg:text-base sm:text-sm text-xs tracking-wide ">
              Benefits of {details.benefits}:
            </h3>
          </>
        )}

        {details?.keyingredients && (
          <>
            <div className="bg-gray-100 shadow-md sm:p-6 p-5 rounded-lg mb-7 mt-9">
              <h3 className="font-semibold tracking-wider sm:text-base text-sm dark-text">
                Key Ingredients
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-line w-full lg:text-base sm:text-sm text-xs tracking-wide ">
              {details?.keyingredients}
            </p>
          </>
        )}

        {details?.recommendeddailyallowance && (
          <>
            <div className="bg-gray-100 shadow-md sm:p-6 p-5 rounded-lg mb-7 mt-9">
              <h3 className="font-semibold tracking-wider sm:text-base text-sm dark-text">
                Recommendeddaily Allowance
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-line w-full lg:text-base sm:text-sm text-xs tracking-wide ">
              {details?.recommendeddailyallowance}
            </p>
          </>
        )}

        {details?.directionsforuse && (
          <>
            <div className="bg-gray-100 shadow-md sm:p-6 p-5 rounded-lg mb-7 mt-9">
              <h3 className="font-semibold tracking-wider sm:text-base text-sm dark-text">
                Directions for use
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-line w-full lg:text-base sm:text-sm text-xs tracking-wide ">
              {details?.directionsforuse}
            </p>
          </>
        )}

        {details?.safetyinformation && (
          <>
            <div className="bg-gray-100 shadow-md sm:p-6 p-5 rounded-lg mb-7 mt-9">
              <h3 className="font-semibold tracking-wider sm:text-base text-sm dark-text">
                Safety information
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-line w-full lg:text-base sm:text-sm text-xs tracking-wide ">
              {details?.safetyinformation}
            </p>
          </>
        )}

        {details?.storage && (
          <>
            <div className="bg-gray-100 shadow-md sm:p-6 p-5 rounded-lg mb-7 mt-9">
              <h3 className="font-semibold tracking-wider sm:text-base text-sm dark-text">
                Satorage
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-line w-full lg:text-base sm:text-sm text-xs tracking-wide ">
              {details?.storage}
            </p>
          </>
        )}
      </div>

      {/* RIGHT: Promotional Card (Hidden on small screens) */}
      <div className="">
        <div className="">
          <img
            src={sale2.src}
            alt="Pharmacist"
            className="w-full object-cover h-full"
          />
          <div className="mx-10 mt-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[20%] h-full bg-white/80 backdrop-blur-md z-10 pointer-events-none"></div>

            <div className="bg-[#0070ba]/40 text-black w-full py-2 rounded-full relative z-0">
              <div className="flex justify-center items-center">
                <a
                  // href="https://kloudpharma.com"
                  className="text-sm cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.kloudpharma.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProDetailsDes;
