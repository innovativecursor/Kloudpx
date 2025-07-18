"use client";

import React, { useState } from "react";
import { BiSortAlt2 } from "react-icons/bi";

const options = [
  "Popular",
  "Discounts",
  "Cost: high to Low",
  "Cost: Low to High",
];

const Sorting = () => {
  const [active, setActive] = useState("Popular");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <div className="hidden md:flex items-center lg:gap-4 md:gap-3 flex-wrap">
        <span className="font-medium dark-text mr-3">Sort by:</span>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setActive(option)}
            className={`lg:px-5 md:px-3 py-2 rounded-md cursor-pointer lg:text-sm md:text-xs font-normal transition 
              ${
                active === option
                  ? "bg-blue-200 dark-text font-semibold"
                  : "bg-blue-50 text-gray-800 hover:bg-blue-100"
              }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div
        className="fixed bottom-0 left-0 w-1/2 bg-white text-sm dark-text border-t border-gray-300 shadow-md text-center py-3 md:hidden cursor-pointer z-30 font-medium"
        onClick={() => setIsMobileOpen(true)}
      >
        <div className="flex justify-center items-center">
          <BiSortAlt2 /> SORT
        </div>
      </div>

      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed bottom-0 left-0 right-0 bg-white z-50 p-5  h-[50vh] flex flex-col shadow-lg">
            {/* Close button */}
            {/* <button
              className="self-end mb-4 text-black font-bold text-3xl leading-none"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close sorting menu"
            >
              &times;
            </button> */}

            <span className="font-light opacity-70 text-base mb-5 border-b  border-gray-200 dark-text">
              Sort by:
            </span>

            <div className="flex flex-col gap-5 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setActive(option);
                    setIsMobileOpen(false);
                  }}
                  className={` rounded-md cursor-pointer text-sm  font-normal text-start transition 
                  ${
                    active === option
                      ? " dark-text font-medium"
                      : "  hover:bg-blue-100"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sorting;
