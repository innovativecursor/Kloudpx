"use client";

import React, { useEffect, useState } from "react";
import { useCartContext } from "@/app/contexts/CartContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import useProductNavigation from "@/app/hooks/useProductNavigation";
import usePageLoader from "@/app/hooks/usePageLoader";

const CartModal = ({ isOpen, onClose, modalRef }) => {
  const { token, isAuthLoaded } = useAuth();
  const router = useRouter();
  const { startLoader } = usePageLoader();
  const { getCartData, removeFromCart, getAllCartData } = useCartContext();
  const { goToProductPage } = useProductNavigation();
  const fallbackImage = "/assets/fallback.png";
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const data = getCartData?.data || [];
  const loading = getCartData?.loading || false;

  useEffect(() => {
    if (token) {
      getAllCartData();
    }
  }, [token]);

  if (!isAuthLoaded) {
    return null;
  }

  const handleCheckout = async () => {
    startLoader();
    setCheckoutLoading(true);
    try {
      router.push("/Checkout");
    } finally {
      onClose();
      setCheckoutLoading(false);
    }
  };

  const handleDelete = (id) => {
    removeFromCart(id);
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40" />}

      <div
        ref={modalRef}
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
          <button
            className="text-[#0070ba] cursor-pointer font-medium flex items-center gap-1"
            onClick={() => {
              startLoader();
              router.push("/Products");
              onClose();
            }}
          >
            <i className="ri-add-line text-xl"></i> Add more
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto thin-scrollbar px-4 md:space-y-4 space-y-8 mt-7">
          {loading ? (
            <h2 className="text-center text-gray-500 mt-8">Loading cart...</h2>
          ) : !data || data.length === 0 ? (
            <h2 className="text-center text-gray-500 mt-8">
              No items in your cart.
            </h2>
          ) : (
            data.map((item) => {
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

              return (
                <div
                  key={item.cart_id}
                  className="flex items-center gap-4 md:p-3 md:shadow-sm rounded-md transition"
                  onClick={() => {
                    onClose();
                    goToProductPage(
                      item?.medicine?.id,
                      item?.medicine?.genericname
                    );
                  }}
                >
                  <div>
                    <img
                      src={imageUrl}
                      alt="product"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <h2 className="text-sm font-medium text-[#0070ba]">
                          {medicine?.genericname || "N/A"}
                        </h2>
                        <h4 className="font-light text-sm mb-1">
                          {medicine?.brandname || "N/A"}
                        </h4>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.cart_id);
                        }}
                        className="ml-2 cursor-pointer font-light text-gray-400"
                        title="Remove"
                      >
                        <i className="ri-close-circle-line text-2xl font-light"></i>
                      </button>
                    </div>

                    <div className="text-base mt-1 font-medium text-[#333]">
                      {discountPercent > 0 ? (
                        <div className="text-sm font-semibold text-[#333]">
                          ₱ {discountedPrice}
                          <span className="text-xs line-through text-gray-400 ml-2">
                            ₱ {price}
                          </span>
                        </div>
                      ) : (
                        <h2 className="text-sm font-semibold text-[#333]">
                          ₱ {price}
                        </h2>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="text-xs">Quantity:</span>{" "}
                        {item?.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {token && data.length > 0 && (
          <div className="p-4 ">
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className={classNames(
                "w-full py-3 rounded-full text-sm font-semibold cursor-pointer text-white transition",
                checkoutLoading
                  ? "bg-[#7aaed8] cursor-not-allowed"
                  : "bg-[#0070BA] hover:bg-[#005c96]"
              )}
            >
              {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartModal;














