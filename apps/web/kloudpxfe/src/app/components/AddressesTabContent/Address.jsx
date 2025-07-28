"use client";

import React, { useState } from "react";
import { FaLocationDot, FaPlus } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import SubTitle from "../Titles/SubTitle";
import NewAddress from "./NewAddress";
import DeliveryType from "../DeliveryData/DeliveryType";
import Screener from "../DeliveryData/Screener";

const Address = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [deliveryType, setDeliveryType] = useState(false);
  const [screener, setScreener] = useState(false);

  return (
    <>
      <SubTitle
        paths={
          showAddForm
            ? ["Cart", "Checkout", "Address", "New Address"]
            : ["Cart", "Checkout", "Address"]
        }
      />

      <div className="pt-8 max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaLocationDot className="text-2xl" />
            <span className="font-medium text-lg">Add Address</span>
          </div>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-[#0070BA] cursor-pointer text-white hover:bg-[#005c96] sm:text-[11px] text-[8px] w-32 flex justify-center items-center py-2 gap-2 rounded-full font-semibold"
            >
              <FaPlus /> <span>Add</span>
            </button>
          )}
        </div>

        {/* Saved Address */}
        {!showAddForm && (
          <div className="border border-[#0070ba] py-4 px-5 mt-10 flex justify-between gap-5 shadow items-start rounded-lg">
            <div className="flex flex-col items-center">
              <IoMdHome className="text-2xl" />
              <span className="font-medium text-sm text-gray-800">Home</span>
            </div>
            <div>
              <p className="text-xs tracking-wide text-gray-600 text-justify">
                Lorem Ipsum is placeholder text used in design and publishing to
                demonstrate the visual form of content, especially when the
                actual content is not yet available
              </p>
            </div>
            <div>
              <input type="radio" className="w-5 h-5" />
            </div>
          </div>
        )}

        {/* Add Address Form */}
        {showAddForm && <NewAddress />}

        {deliveryType && <DeliveryType />}
        {/* <DeliveryType /> */}

        <Screener />
      </div>
    </>
  );
};

export default Address;
