"use client";

import React, { useEffect, useState } from "react";
import { useCartContext } from "@/app/contexts/CartContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import useProductNavigation from "@/app/hooks/useProductNavigation";
import { useCheckout } from "@/app/contexts/CheckoutContext";

const CartModal = ({ isOpen, onClose }) => {
  const { token, isAuthLoaded } = useAuth();
  const router = useRouter();
  const { getCartData, removeFromCart, getAllCartData } = useCartContext();
  const { toggleSaveForLater, savedForLaterIds, doCheckout } = useCheckout();
  const { goToProductPage } = useProductNavigation();
  const fallbackImage = "/assets/fallback.png";
  const [activeTab, setActiveTab] = useState("All");

  const data = getCartData?.data || [];
  const loading = getCartData?.loading || false;

  // console.log(getCartData);

  // const handleSaveForLater = async (cartId) => {
  //   await toggleSaveForLater(cartId);
  // };

  useEffect(() => {
    if (token) {
      getAllCartData();
    }
  }, [token]);

  if (!isAuthLoaded) {
    return null;
  }

  // const handleCheckout = async () => {
  //   try {
  //     await doCheckout();
  //     router.push("/Address");
  //     onClose();
  //   } catch (error) {
  //     toast.error("Checkout failed, please try again.");
  //   }
  // };

  const handleCheckout = async () => {
    router.push("/Checkout");
    onClose();
  };

  const handleDelete = (id) => {
    removeFromCart(id);
  };

  const filteredData = data?.filter((item) => {
    if (activeTab === "All") return true;
    if (activeTab === "Regular")
      return item.prescription_status === "Not Required";
    if (activeTab === "Prescribed Drug")
      return item.prescription_status !== "Not Required";
    return true;
  });

  // const hasUnsettledItems = filteredData.some(
  //   (item) => item.prescription_status === "Unsettled"
  // );

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        className={classNames(
          "fixed top-0 right-0 w-[420px] max-w-full h-full bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col",
          {
            "translate-x-0": isOpen,
            "translate-x-full": !isOpen,
          }
        )}
      >
        {/* Header */}
        <div className="flex justify-end items-end mt-1">
          <button
            onClick={onClose}
            className="text-2xl text-gray-600 cursor-pointer hover:text-black transition"
            title="Close"
          >
            <i className="ri-close-line mr-3"></i>
          </button>
        </div>

        <div className="p-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Cart</h2>
            <h2 className="text-base opacity-50">
              {data?.length || 0} Items in your cart
            </h2>
          </div>
          {/* <button
            className="text-[#0070ba] cursor-pointer font-medium flex items-center gap-1"
            onClick={() => router.push("/")}
          >
            <i className="ri-add-line text-xl"></i> Add more
          </button> */}
        </div>

        {/* Tabs */}
        <div className="flex justify-between items-center px-4 py-2">
          {["All", "Regular", "Prescribed Drug"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={classNames(
                "md:px-7 px-6 py-2 rounded-full border cursor-pointer md:text-sm text-xs font-medium transition-all",
                activeTab === tab
                  ? "border-[#0070ba] text-[#0070ba]"
                  : "bg-gray-100 text-gray-700 border-gray-100"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto thin-scrollbar px-4 md:space-y-4 space-y-8 mt-7">
          {loading ? (
            <h2 className="text-center text-gray-500 mt-8">Loading cart...</h2>
          ) : !filteredData || filteredData.length === 0 ? (
            <h2 className="text-center text-gray-500 mt-8">
              No items in this category.
            </h2>
          ) : (
            filteredData.map((item) => {
              const medicine = item?.medicine;
              const imageUrl =
                Array.isArray(medicine?.images) && medicine.images[0]
                  ? medicine.images[0]
                  : fallbackImage;
              const price = medicine?.price || 0;
              const discountPercent =
                parseFloat(medicine?.discount?.replace("%", "")) || 0;
              const discountedPrice = (
                price -
                (price * discountPercent) / 100
              ).toFixed(2);

              const isUnsettled = item.prescription_status === "Unsettled";
              const isRejected = item.prescription_status === "Rejected";

              return (
                <div
                  key={item.cart_id}
                  className={classNames(
                    "flex items-center gap-4 md:p-3 md:shadow-sm rounded-md transition",
                    {
                      "bg-gray-200 opacity-60 pointer-events-none": isUnsettled,
                      "bg-red-100 border border-red-400": isRejected,
                    }
                  )}
                >
                  <div
                    onClick={() =>
                      goToProductPage(
                        item?.medicine?.id,
                        item?.medicine?.genericname
                      )
                    }
                  >
                    <img
                      src={imageUrl}
                      alt="product"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <h2 className="text-sm font-light text-[#0070ba]">
                          {medicine?.genericname || "N/A"}
                        </h2>
                        <h4 className="font-medium text-sm mb-1">
                          {medicine?.brandname || "N/A"}
                        </h4>
                      </div>
                      <button
                        onClick={() => handleDelete(item.cart_id)}
                        className="ml-2 cursor-pointer font-light text-gray-400"
                        title="Remove"
                      >
                        <i className="ri-close-circle-line text-2xl font-light"></i>
                      </button>
                    </div>

                    <div className="text-base mt-1 font-medium text-[#333]">
                      {discountPercent > 0 ? (
                        <div className="text-sm font-semibold text-[#333]">
                          ₱{discountedPrice}
                          <span className="text-xs line-through text-gray-400 ml-2">
                            ₱{price}
                          </span>
                        </div>
                      ) : (
                        <h2 className="text-sm font-semibold text-[#333]">
                          ₱{price}
                        </h2>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="text-xs">Quantity:</span>{" "}
                        {item?.quantity}
                      </div>

                      {/* <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={savedForLaterIds.includes(item.cart_id)}
                          onChange={() => handleSaveForLater(item.cart_id)}
                          className="appearance-none bg-transparent border border-[#0070ba] cursor-pointer rounded-full sm:w-3 sm:h-3 w-1 h-1 checked:bg-blue-500"
                        />
                        <label className="text-[9px]">Save for Later</label>
                      </div> */}
                    </div>

                    {/* Prescription Status (optional label) */}
                    {isUnsettled && (
                      <p className="text-xs text-red-500 mt-1">
                        Waiting for pharmacist approval before purchase
                      </p>
                    )}
                    {isRejected && (
                      <p className="text-xs text-red-500 mt-1">
                        This item was rejected by the pharmacist.
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Checkout Button */}
        {/* {filteredData?.length > 0 && (
          <div className="p-4">
            <button
              onClick={handleCheckout}
              disabled={hasUnsettledItems}
              className={classNames(
                "w-full py-3 rounded-full font-semibold cursor-pointer",
                hasUnsettledItems
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#0070BA] text-white hover:bg-[#005c96]"
              )}
            >
              Proceed to Checkout
            </button>
          </div>
        )} */}

        <div className="p-4">
          <button
            onClick={handleCheckout}
            // disabled={hasUnsettledItems}
            className="w-full py-3 rounded-full font-semibold cursor-pointer bg-[#0070BA] text-white hover:bg-[#005c96]"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default CartModal;
