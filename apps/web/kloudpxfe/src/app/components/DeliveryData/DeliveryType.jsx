"use client";

import React, { useState } from "react";

const DeliveryType = () => {
  const [selected, setSelected] = useState("standard");

  return (
    <div className="mt-10">
      {/* Standard Delivery */}
      <label
        htmlFor="standard"
        className={`flex justify-between items-center py-5 px-6 rounded-xl cursor-pointer border ${
          selected === "standard"
            ? "bg-[#EDF4F6] border-[#0070BA]"
            : "bg-[#EDF4F6] border-transparent"
        } mb-4 transition-all`}
      >
        <div className="flex items-center gap-4">
          <input
            type="radio"
            id="standard"
            name="delivery"
            value="standard"
            checked={selected === "standard"}
            onChange={() => setSelected("standard")}
            className="accent-[#0070BA] mt-1 w-5 h-5"
          />
          <div>
            <h3 className="font-medium tracking-wide text-base text-[#00243f]">
              Standard Delivery
            </h3>
            <span className="text-xs tracking-wide text-gray-600">
              Get your medicines delivered next day.
            </span>
          </div>
        </div>
        <span className="text-[#00243f] font-medium text-lg">₱0</span>
      </label>

      {/* Priority Delivery (Now same design as Standard) */}
      <label
        htmlFor="priority"
        className={`flex justify-between items-center py-5 px-6 rounded-xl cursor-pointer border ${
          selected === "priority"
            ? "bg-[#EDF4F6] border-[#0070BA]"
            : "bg-[#EDF4F6] border-transparent"
        } mb-4 transition-all`}
      >
        <div className="flex items-center gap-4">
          <input
            type="radio"
            id="priority"
            name="delivery"
            value="priority"
            checked={selected === "priority"}
            onChange={() => setSelected("priority")}
            className="accent-[#0070BA] mt-1 w-5 h-5"
          />
          <div>
            <h3 className="font-medium tracking-wide text-base text-[#00243f]">
              Priority Delivery
            </h3>
            <span className="text-xs tracking-wide text-gray-600">
              Get your medicines delivered on the same day.
            </span>
          </div>
        </div>
        <span className="text-[#00243f] font-medium text-lg">₱20</span>
      </label>

      {/* Continue to Pay */}
      <div className="pt-8">
        <button
          type="submit"
          className="bg-[#0070BA] text-white cursor-pointer w-full py-3 text-sm rounded-full font-medium hover:bg-[#005c96]"
        >
          Continue to Pay
        </button>
      </div>
    </div>
  );
};

export default DeliveryType;
