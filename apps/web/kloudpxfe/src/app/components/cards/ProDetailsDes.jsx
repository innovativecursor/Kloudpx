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
          <div className="font-semibold tracking-wider sm:text-base text-sm dark-text">
            <span className="uppercase">{details.brandname}</span>: Your daily
            essential for vitality and well-being
          </div>
        </div>

        <span className="text-gray-700 mb-7 w-full text-justify break-words hyphens-auto leading-relaxed">
          {details.description}
        </span>

        {details.benefits && (
          <>
            <h3 className="text-gray-700 leading-relaxed text-justify break-words hyphens-auto whitespace-pre-line w-full lg:text-base sm:text-sm text-xs tracking-wide ">
              Benefits of {details.benefits}:
            </h3>
          </>
        )}

        {details?.keyingredients && (
          <>
            <div className="bg-gray-100 shadow-md sm:p-6 p-5 rounded-lg mb-7 mt-9">
              <h3 className="font-semibold uppercase tracking-wider sm:text-base text-sm dark-text">
                Key Ingredients
              </h3>
            </div>

            <span className="text-gray-700 leading-relaxed text-justify break-words hyphens-auto whitespace-pre-line w-full lg:text-base sm:text-sm text-xs tracking-wide ">
              {details?.keyingredients}
            </span>
          </>
        )}

        {details?.recommendeddailyallowance && (
          <>
            <div className="bg-gray-100 shadow-md sm:p-6 p-5 rounded-lg mb-7 mt-9">
              <h3 className="font-semibold uppercase tracking-wider sm:text-base text-sm dark-text">
                Recommended Usual Dose
              </h3>
            </div>

            <span className="text-gray-700 leading-relaxed text-justify break-words hyphens-auto whitespace-pre-line w-full lg:text-base sm:text-sm text-xs tracking-wide ">
              {details?.recommendeddailyallowance}
            </span>
          </>
        )}

        {details?.directionsforuse && (
          <>
            <div className="bg-gray-100 shadow-md sm:p-6 p-5 rounded-lg mb-7 mt-9">
              <h3 className="font-semibold uppercase tracking-wider sm:text-base text-sm dark-text">
                Directions for use
              </h3>
            </div>

            <span className="text-gray-700 leading-relaxed text-justify break-words hyphens-auto whitespace-pre-line w-full lg:text-base sm:text-sm text-xs tracking-wide ">
              {details?.directionsforuse}
            </span>
          </>
        )}

        {details?.safetyinformation && (
          <>
            <div className="bg-gray-100 shadow-md sm:p-6 p-5 rounded-lg mb-7 mt-9">
              <h3 className="font-semibold uppercase tracking-wider sm:text-base text-sm dark-text">
                Safety information
              </h3>
            </div>

            <span className="text-gray-700 leading-relaxed text-justify break-words hyphens-auto whitespace-pre-line w-full lg:text-base sm:text-sm text-xs tracking-wide ">
              {details?.safetyinformation}
            </span>
          </>
        )}

        {details?.storage && (
          <>
            <div className="bg-gray-100 shadow-md sm:p-6 p-5 rounded-lg mb-7 mt-9">
              <h3 className="font-semibold uppercase tracking-wider sm:text-base text-sm dark-text">
                Storage
              </h3>
            </div>

            <span className="text-gray-700 leading-relaxed text-justify break-words hyphens-auto whitespace-pre-line w-full lg:text-base sm:text-sm text-xs tracking-wide ">
              {details?.storage}
            </span>
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
                  href="https://kloudpx.com/"
                  className="text-sm cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.kloudpx.com
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
