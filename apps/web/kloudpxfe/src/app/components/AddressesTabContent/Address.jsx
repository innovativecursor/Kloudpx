"use client";

import React, { useEffect, useState } from "react";
import { FaLocationDot, FaPlus } from "react-icons/fa6";
import SubTitle from "../Titles/SubTitle";
import NewAddress from "./NewAddress";
import DeliveryType from "../DeliveryData/DeliveryType";
import Screener from "../DeliveryData/Screener";
import { useCheckout } from "@/app/contexts/CheckoutContext";
import { IoMdHome } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import toast from "react-hot-toast";

const Address = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [deliveryType, setDeliveryType] = useState(false);
  const [deliverySuccess, setDeliverySuccess] = useState(false);
  const [screener, setScreener] = useState(false);
  // const [selectedId, setSelectedId] = useState(0);
  const {
    fetchAddressData,
    getAllAddress,
    handleEdit,
    selectedAddress,
    selectedId,
    setSelectedId,
  } = useCheckout();

  useEffect(() => {
    if (Array.isArray(getAllAddress) && getAllAddress.length === 0) {
      fetchAddressData();
    }
  }, []);

  // console.log(getAllAddress, "my add ");

  return (
    <>
      <SubTitle
        paths={
          deliveryType
            ? ["Cart", "Checkout", "Address", "Delivery Type"]
            : showAddForm
            ? ["Cart", "Checkout", "Address", "New Address"]
            : ["Cart", "Checkout", "Address"]
        }
      />

      <div className="pt-8 ">
        {/* Header */}

        {!deliveryType && (
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
        )}

        {/* Saved Address */}
        {!deliveryType && (
          <>
            {!showAddForm && getAllAddress && getAllAddress.length > 0 && (
              <>
                {getAllAddress.map((address, index) => (
                  <div
                    key={address.ID || index}
                    className="border border-[#0070ba] py-4 px-5 mt-10 flex justify-between gap-5 shadow items-start rounded-lg"
                  >
                    <div className="flex flex-col items-center">
                      <IoMdHome className="text-2xl" />
                      <span className="font-medium text-sm text-gray-800">
                        {address?.Barangay}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs tracking-wide text-gray-600 text-justify">
                        <span className="font-semibold">
                          {address?.NameResidency}
                        </span>
                        , {address?.City}, {address?.Region},{" "}
                        {address?.Province}, {address?.ZipCode}
                      </div>
                    </div>

                    <div className="flex gap-2 mt8">
                      <div>
                        <input
                          type="radio"
                          className="w-5 h-5 rounded-full"
                          name="selectedAddress"
                          checked={selectedId === address.ID}
                          onChange={() => setSelectedId(address.ID)}
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

                <button
                  type="button"
                  onClick={() => {
                    let selectedAddressId = selectedId;

                    if (!selectedAddressId) {
                      const defaultAddress = getAllAddress.find(
                        (addr) => addr.IsDefault === true
                      );
                      if (defaultAddress) {
                        selectedAddressId = defaultAddress.ID;
                      }
                    }

                    if (selectedAddressId) {
                      selectedAddress(selectedAddressId);
                      setSelectedId(selectedAddressId);
                      setDeliveryType(true);
                    } else {
                      toast.error("Please select an address");
                    }
                  }}
                  className="bg-[#0070BA] text-white cursor-pointer md:mt-10 mt-8 w-full py-3 sm:text-sm text-xs rounded-full font-medium hover:bg-[#005c96]"
                >
                  Save & Proceed
                </button>
              </>
            )}

            {showAddForm && <NewAddress setShowAddForm={setShowAddForm} />}
          </>
        )}

        {deliveryType && !deliverySuccess && (
          <DeliveryType setDeliverySuccess={setDeliverySuccess} />
        )}
        {deliverySuccess && <Screener />}
      </div>
    </>
  );
};

export default Address;
