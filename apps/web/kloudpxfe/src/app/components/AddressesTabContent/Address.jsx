"use client";

import React, { useEffect, useState } from "react";
import { FaLocationDot, FaPlus } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import SubTitle from "../Titles/SubTitle";
import NewAddress from "./NewAddress";
import DeliveryType from "../DeliveryData/DeliveryType";
import Screener from "../DeliveryData/Screener";
import { useCheckout } from "@/app/contexts/CheckoutContext";
import { FaRegEdit } from "react-icons/fa";

const Address = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [deliveryType, setDeliveryType] = useState(false);
  const [screener, setScreener] = useState(false);
  const { fetchAddressData, getAllAddress, handleEdit } = useCheckout();

  useEffect(() => {
    if (Array.isArray(getAllAddress) && getAllAddress.length === 0) {
      fetchAddressData();
    }
  }, []);

  console.log(getAllAddress);

  return (
    <>
      <SubTitle
        paths={
          showAddForm ? ["Cart", "Address", "New Address"] : ["Cart", "Address"]
        }
      />

      <div className="pt-8 ">
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
        {!showAddForm &&
          getAllAddress &&
          getAllAddress.length > 0 &&
          getAllAddress.map((address, index) => (
            <div
              key={address.ID || index}
              className="border border-[#0070ba] py-4 px-5 mt-10 flex justify-between gap-5 shadow items-start rounded-lg"
            >
              <div className="flex flex-col items-center">
                <IoMdHome className="text-2xl" />
                <span className="font-medium text-sm text-gray-800">Home</span>
              </div>
              <div>
                <p className="text-xs tracking-wide text-gray-600 text-justify">
                  <span className="font-semibold">{address.NameResidency}</span>
                  , {address.City}, {address.Region}, {address.Province},{" "}
                  {address.ZipCode}
                </p>
              </div>
              <div className="flex gap-2">
                <div>
                  <input
                    type="radio"
                    className="w-5 h-5 rounded-full"
                    name="selectedAddress"
                    checked={address.IsDefault === true}
                    readOnly
                  />
                </div>
                <div
                  onClick={() => {
                    setShowAddForm(true);
                    handleEdit(address);
                  }}
                  className="cursor-pointer"
                >
                  <FaRegEdit className="text-xl" />
                </div>
              </div>
            </div>
          ))}

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
