"use client";

import React, { useState } from "react";

const options = [
  "Popular",
  "Discounts",
  "Cost: high to Low",
  "Cost: Low to High",
];

const Sorting = () => {
  const [active, setActive] = useState("Popular");

  return (
    <div className="flex items-center lg:gap-4 md:gap-3 flex-wrap">
      <span className="font-medium dark-text">Sort by:</span>
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
  );
};

export default Sorting;
