"use client";

import React, { useEffect, useState } from "react";
import { FaLocationArrow, FaPlus, FaRegEdit, FaTrash } from "react-icons/fa";
import { IoMdHome, IoMdCall } from "react-icons/io";
import { IoLocation } from "react-icons/io5";
import SubTitle from "../Titles/SubTitle";
import NewAddress from "./NewAddress";
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [deliveryType, setDeliveryType] = useState(false);
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
    if (!addresses || addresses.length === 0) return;
    if (!selectedId) {
      const defaultAddress = addresses.find((addr) => addr.IsDefault);
      if (defaultAddress) setSelectedId(defaultAddress.ID);
    }
  }, [addresses, selectedId]);

  const handleSaveAndProceed = () => {
    if (!checkoutData?.items || checkoutData.items.length === 0) {
      toast.error("No items in checkout. Add items first!");
      return;
    }

    let selectedAddressId = selectedId;

    if (!selectedAddressId) {
      const defaultAddress = addresses.find((addr) => addr.IsDefault === true);
      if (defaultAddress) {
        selectedAddressId = defaultAddress.ID;
      }
    }

    if (selectedAddressId) {
      startLoader();
      selectedAddress(selectedAddressId);
      setSelectedId(selectedAddressId);
      router.push("Delivery");
    } else {
      toast.error("Please select an address");
    }
  };

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

      <div className="pt-8">
        {!deliveryType && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaLocationArrow className="text-2xl" />
              <span className="font-medium text-lg">Add Address</span>
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-[#0070BA] text-white hover:bg-[#005c96] sm:text-[11px] text-[8px] w-32 flex justify-center items-center py-2 gap-2 rounded-full font-semibold"
              >
                <FaPlus /> <span>Add</span>
              </button>
            )}
          </div>
        )}

        {!deliveryType && (
          <>
            {!showAddForm && addresses && addresses.length > 0 && (
              <>
                {addresses.map((address, index) => (
                  <div
                    key={address.ID || index}
                    className="border border-[#0070ba] w-full py-4 px-2 mt-10 flex justify-between gap-2 shadow items-center rounded-lg"
                  >
                    <div className="flex flex-col items-center text-center sm:w-1/6 sm:min-w-[40px] sm:max-w-[40px] w-12">
                      <IoMdHome className="sm:text-2xl text-xl text-[#0070ba]" />
                      <span className="font-medium sm:text-[10px] text-[9px] text-gray-800 break-words mt-1 w-full overflow-hidden text-ellipsis">
                        {address?.AddressType?.TypeName || "N/A"}
                      </span>
                    </div>

                    <div className="w-[70%]">
                      <div className="text-xs tracking-wide text-gray-700 flex flex-col gap-2">
                        <div className="flex gap-1 items-start">
                          <IoMdCall className="text-base" />
                          <span>{address?.PhoneNumber || "N/A"}</span>
                        </div>
                        <div className="flex gap-1 items-start">
                          <IoLocation className="text-lg sm:text-base" />
                          <span className="text-xs ">
                            {address?.City || "N/A"}, {address?.Region || "N/A"}
                            , {address?.Province || "N/A"},{" "}
                            {address?.ZipCode || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center w-[12%] sm:w-[12%] gap-2">
                      <input
                        type="radio"
                        checked={selectedId === address.ID}
                        onChange={() => setSelectedId(address.ID)}
                        className="w-8 h-8"
                      />
                      <div
                        onClick={() => {
                          setShowAddForm(true);
                          handleEdit({
                            ...address,
                            addresstype:
                              address.AddressTypeID ??
                              address.AddressType?.ID ??
                              null,
                          });
                        }}
                        className="cursor-pointer"
                      >
                        <FaRegEdit className="sm:text-xl" />
                      </div>
                      <div
                        onClick={() => handleDeleteAddress(address.ID)}
                        className="cursor-pointer"
                      >
                        <FaTrash className=" text-red-500 hover:text-red-700" />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleSaveAndProceed}
                  className="bg-[#0070BA] text-white w-full py-3 sm:text-sm text-xs rounded-full font-medium mt-8 md:mt-10 cursor-pointer hover:bg-[#005c96]"
                >
                  Save & Proceed
                </button>
              </>
            )}

            {showAddForm && <NewAddress setShowAddForm={setShowAddForm} />}
          </>
        )}
      </div>
    </>
  );
};

export default Address;
