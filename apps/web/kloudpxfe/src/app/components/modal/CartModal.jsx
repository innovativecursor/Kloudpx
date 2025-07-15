"use client";

import React, { useEffect, useState } from "react";
import { useCartContext } from "@/app/contexts/CartContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import classNames from "classnames";

const CartDrawer = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const router = useRouter();
  const { getCartData, removeFromCart, getAllCartData } = useCartContext();
  const { data, loading } = getCartData;

  const fallbackImage = "/assets/demo.jpg";
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (token === null && !storedToken) {
      router.push("/");
    }
  }, [token]);

  useEffect(() => {
    getAllCartData();
  }, []);

  const handleCheckout = () => {
    router.push("/Checkout");
    onClose();
  };

  const handleDelete = (id) => {
    removeFromCart(id);
  };

  const filteredData = data?.filter((item) => {
    if (activeTab === "All") return true;
    if (activeTab === "Regular") return !item?.Prescription;
    if (activeTab === "Prescribed Drug") return item?.Prescription;
    return true;
  });

  console.log(data);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      )}

      <div
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
            className="text-2xl text-gray-600 hover:text-black transition"
            title="Close"
          >
            <i class="ri-close-line mr-3"></i>
          </button>
        </div>
        <div className="p-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Cart</h2>
            <p className="text-base opacity-50">
              {data?.length || 0} Items in your cart
            </p>
          </div>
          <button
            className="text-[#0070ba] cursor-pointer font-medium flex items-center gap-1"
            onClick={() => router.push("/")}
          >
            <i className="ri-add-line text-xl"></i> Add more
          </button>
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
        <div className="flex-1 overflow-y-auto px-4 md:space-y-4 space-y-8 mt-7">
          {loading ? (
            <p className="text-center text-gray-500 mt-8">Loading cart...</p>
          ) : !filteredData || filteredData.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">
              No items in this category.
            </p>
          ) : (
            filteredData.map((item) => {
              const medicine = item?.medicine;
              const imageUrl = medicine?.images || fallbackImage;
              const price = medicine?.price || 0;

              const discountPercent =
                parseFloat(medicine?.discount?.replace("%", "")) || 0;
              const discountedPrice = (
                price -
                (price * discountPercent) / 100
              ).toFixed(2);

              return (
                <div
                  key={item.ID}
                  className="flex items-center gap-4  md:p-3 md:shadow-sm"
                >
                  <div className="">
                    <img
                      src={imageUrl}
                      alt="product"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </div>
                  <div className=" flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <p className="text-base font-light  text-[#0070ba]">
                          {medicine?.genericname || "N/A"}
                        </p>
                        <h4 className="font-medium text-base mb-1">
                          {medicine?.brandname || "N/A"}
                        </h4>
                      </div>
                      <button
                        onClick={() => handleDelete(item.cart_id)}
                        className="ml-2 cursor-pointer font-light text-gray-400"
                        title="Remove"
                      >
                        <i class="ri-close-circle-line text-2xl font-light"></i>
                      </button>
                    </div>

                    <div className="text-base mt-2 font-medium text-[#333]">
                      {discountPercent > 0 ? (
                        <div className="text-sm font-semibold text-[#333]">
                          ₱{discountedPrice}
                          <span className="text-xs line-through text-gray-400 ml-2">
                            ₱{price}
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm font-semibold text-[#333]">
                          ₱{price}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity Control (non-functional now) */}
                  {/* <div className="flex items-center gap-1">
                    <button className="w-7 h-7 bg-indigo-100 text-lg rounded-full">
                      –
                    </button>
                    <span className="w-6 text-center">{item.Quantity}</span>
                    <button className="w-7 h-7 bg-indigo-100 text-lg rounded-full">
                      +
                    </button>
                  </div> */}

                  {/* Remove Button */}
                </div>
              );
            })
          )}
        </div>

        {/* Checkout Button */}
        {filteredData?.length > 0 && (
          <div className="p-4 ">
            <button
              onClick={handleCheckout}
              className="w-full bg-[#0070BA] text-white py-3 rounded-full cursor-pointer font-semibold hover:bg-[#005c96]"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
