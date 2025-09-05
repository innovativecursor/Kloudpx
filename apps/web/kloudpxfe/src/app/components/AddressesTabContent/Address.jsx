"use client";

import React, { useEffect } from "react";
import { FaLocationArrow, FaPlus, FaRegEdit, FaTrash } from "react-icons/fa";
import { IoMdHome, IoMdCall } from "react-icons/io";
import { IoLocation } from "react-icons/io5";
import SubTitle from "../Titles/SubTitle";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/app/contexts/CheckoutContext";
import toast from "react-hot-toast";
import usePageLoader from "@/app/hooks/usePageLoader";

const normalizeAddresses = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  const result = [];
  Object.entries(data).forEach(([, value]) => {
    if (!value) return;
    if (Array.isArray(value)) result.push(...value);
    else if (typeof value === "object") result.push(value);
  });
  return result;
};

const Address = () => {
  const router = useRouter();
  const {
    fetchAddressData,
    getAllAddress,
    handleEdit,
    selectedAddress,
    selectedId,
    setSelectedId,
    checkoutData,
    handleDeleteAddress,
  } = useCheckout();

  const { startLoader } = usePageLoader();
  const addresses = normalizeAddresses(getAllAddress);

  useEffect(() => {
    fetchAddressData();
  }, []);

  useEffect(() => {
    if (!addresses || addresses?.length === 0) return;
    if (!selectedId) {
      const defaultAddress = addresses?.find((addr) => addr?.IsDefault);
      if (defaultAddress) setSelectedId(defaultAddress?.ID);
    }
  }, [addresses, selectedId]);

  const handleSaveAndProceed = () => {
    if (!checkoutData?.items || checkoutData?.items?.length === 0) {
      toast.error("No items in checkout. Add items first!");
      return;
    }

    let selectedAddressId = selectedId;
    if (!selectedAddressId) {
      const defaultAddress = addresses?.find(
        (addr) => addr?.isDefault === true
      );
      if (defaultAddress?.id) {
        selectedAddressId = defaultAddress?.id;
      }
    }

    if (selectedAddressId) {
      startLoader();
      selectedAddress(selectedAddressId);
      setSelectedId(selectedAddressId);
      router.push("/Delivery");
    } else {
      toast.error("Please select an address");
    }
  };

  return (
    <>
      <SubTitle paths={["Cart", "Checkout", "Address"]} />

      <div className="pt-8">
        {/* Header */}
        <div className="flex justify-between items-center md:mb-6 mb-8">
          <div className="flex items-center gap-2">
            <FaLocationArrow className="md:text-2xl text-[#0070BA]" />
            <span className="font-semibold md:text-lg ">Manage Addresses</span>
          </div>
          <button
            onClick={() => {
              startLoader("/NewAddress");
              router.push("/NewAddress");
            }}
            className="bg-[#0070BA] hover:bg-[#005c96] text-white cursor-pointer 
            sm:text-sm text-xs md:px-6 px-4 md:py-2 py-1.5 flex items-center gap-2 rounded-full font-medium shadow"
          >
            <FaPlus /> <span>Add</span>
          </button>
        </div>

        {/* Addresses */}
        {addresses && addresses?.length > 0 ? (
          <>
            <div className="space-y-4">
              {addresses.map((address, index) => (
                <div
                  key={address?.ID || index}
                  className={`border ${
                    selectedId === address.ID
                      ? "border-[#0070BA] shadow-md"
                      : "border-gray-300"
                  } bg-white p-4 flex justify-between items-center rounded-xl transition-all`}
                >
                  {/* Address Type */}
                  <div className="flex flex-col items-center text-center md:w-16 w-10 shrink-0">
                    <IoMdHome className="text-2xl text-[#0070BA]" />
                    <span className="text-[10px] font-medium text-gray-600 mt-1">
                      {address?.AddressType?.TypeName || "N/A"}
                    </span>
                  </div>

                  {/* Address Details */}
                  <div className="flex-1 px-3">
                    <div className="md:text-xs text-[10px] text-gray-700 space-y-1">
                      <div className="flex items-center gap-2">
                        <IoMdCall className="text-sm text-[#0070BA]" />
                        <span>{address?.PhoneNumber || "N/A"}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <IoLocation className="text-sm text-[#0070BA] mt-0.5" />
                        <span>
                          {address?.City || "N/A"}, {address?.Region || "N/A"},{" "}
                          {address?.Province || "N/A"},{" "}
                          {address?.ZipCode || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center md:gap-3 gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={selectedId === address?.ID}
                      onChange={() => setSelectedId(address?.ID)}
                      className="md:w-5 md:h-5 w-4 h-4 text-[#0070BA] accent-[#0070BA] cursor-pointer"
                    />
                    <button
                      onClick={() => {
                        handleEdit({
                          ...address,
                          addresstype:
                            address.AddressTypeID ??
                            address.AddressType?.ID ??
                            null,
                        });
                        router.push("/NewAddress");
                      }}
                      className="text-gray-600 hover:text-[#0070BA]  cursor-pointer"
                    >
                      <FaRegEdit className="md:text-lg" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address?.ID)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <FaTrash className="md:text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Save & Proceed */}
            <button
              type="button"
              onClick={handleSaveAndProceed}
              className="bg-[#0070BA] hover:bg-[#005c96] text-white w-full py-3 
              sm:text-sm text-xs rounded-full font-semibold mt-8 shadow cursor-pointer"
            >
              Save & Proceed
            </button>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No address found. Please add one.
          </p>
        )}
      </div>
    </>
  );
};

export default Address;
