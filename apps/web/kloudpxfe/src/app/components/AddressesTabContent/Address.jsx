"use client";

import React, { useEffect, useState } from "react";
import { FaLocationDot, FaPlus } from "react-icons/fa6";
import SubTitle from "../Titles/SubTitle";
import NewAddress from "./NewAddress";
import DeliveryType from "../DeliveryData/DeliveryType";
// import Screener from "../DeliveryData/Screener";
import { useCheckout } from "@/app/contexts/CheckoutContext";
import { IoMdHome } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import toast from "react-hot-toast";
// import Cod from "../DeliveryData/Cod";
import { IoLocation } from "react-icons/io5";
import { IoMdCall } from "react-icons/io";

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
    deliveryData,
  } = useCheckout();

  useEffect(() => {
    if (Array.isArray(getAllAddress) && getAllAddress.length === 0) {
      fetchAddressData();
    }
  }, []);

  // console.log(getAllAddress, "my add ");

  useEffect(() => {
    if (Array.isArray(getAllAddress) && getAllAddress.length > 0) {
      const defaultAddress = getAllAddress.find((addr) => addr.IsDefault);
      if (defaultAddress && !selectedId) {
        setSelectedId(defaultAddress.ID);
      }
    }
  }, [getAllAddress]);

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
                    className="border border-[#0070ba] w-full py-4 px-2  mt-10 flex justify-between sm:gap-5 gap-2 shadow items-center rounded-lg"
                  >
                    <div className="flex flex-col  items-center text-center sm:w-1/6 sm:min-w-[80px] sm:max-w-[100px] w-12">
                      <IoMdHome className="sm:text-2xl text-xl text-[#0070ba]" />
                      <span className="font-medium sm:text-[10px] text-[9px] text-gray-800 break-words mt-1 w-full overflow-hidden text-ellipsis">
                        {address?.NameResidency}
                      </span>
                    </div>

                    <div className="w-[70%]">
                      <div className="text-xs tracking-wide text-gray-700 flex flex-col items-start justify-center gap-2">
                        <div className="flex gap-1 items-start">
                          <IoMdCall className="text-base" />
                          <span>{address?.PhoneNumber || "N/A"}</span>
                        </div>
                        <div className="flex gap-1 items-start">
                          <IoLocation className="text-lg sm:text-base" />
                          <span className="text-xs ">
                            {address?.City || "N/A"},{address?.Region || "N/A"},{" "}
                            {address?.Province || "N/A"},{" "}
                            {address?.ZipCode || "N/A"}{" "}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-[12%] sm:w-[10%]  gap-2 ">
                      <div>
                        <input
                          type="radio"
                          className="sm:w-5 sm:h-5 cursor-pointer w-4 h-4 rounded-full"
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
                        <FaRegEdit className="sm:text-xl" />
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

        {/* {deliveryType && !deliverySuccess && (
          <DeliveryType setDeliverySuccess={setDeliverySuccess} />
        )} */}

        {deliveryType && !deliverySuccess && <DeliveryType />}

        {/* {deliverySuccess && deliveryData?.delivery_type === "cod" ? (
          <Cod />
        ) : (
          deliverySuccess && <Screener />
        )} */}
      </div>
    </>
  );
};

export default Address;
