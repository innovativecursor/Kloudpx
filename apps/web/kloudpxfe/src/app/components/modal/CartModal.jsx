"use client";
import React, { useEffect } from "react";
import { useCartContext } from "@/app/contexts/CartContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import classNames from "classnames";

const CartDrawer = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const router = useRouter();
  const { getCartData, removeFromCart } = useCartContext();
  const { data, loading } = getCartData;
  console.log(data);

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token]);

  const handleCheckout = () => {
    router.push("/Checkout");
    onClose();
  };

  const handleDelete = (id) => {
    removeFromCart(id);
  };

  // conse data  

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        className={classNames(
          "fixed top-0 right-0 w-80 max-w-full h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 flex flex-col",
          {
            "translate-x-0": isOpen,
            "translate-x-full": !isOpen,
          }
        )}
      >
        <div className="p-4 text-sm flex-1 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-base">Your Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-black"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>

          {/* Cart Items */}
          {loading ? (
            <p className="text-center text-gray-500">Loading cart...</p>
          ) : !data || data.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {data.map((item) => {
                const medicine = item?.Medicine;
                const imageUrl =
                  medicine?.ItemImages?.[0]?.FileName ||
                  "https://via.placeholder.com/50";
                const prescriptionImage = item?.Prescription?.UploadedImage || null;
                const createdAt =
                  item?.Prescription?.CreatedAt || item?.CreatedAt;
                const formattedDate = new Date(createdAt).toLocaleDateString(
                  "en-IN"
                );

                return (
                  <li
                    key={item.ID}
                    className="relative p-2 rounded-md transition-all hover:bg-[#0070ba] hover:text-white border border-gray-100"
                  >
                    {/* Prescription Image */}
                    {prescriptionImage && (
                      <div className="mb-2">
                        <img
                          src={prescriptionImage}
                          alt="prescription"
                          className="w-full h-16 object-cover rounded border"
                        />
                        <p className="text-[10px] text-gray-500 mt-1">
                          Date: {formattedDate}
                        </p>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <img
                        src={imageUrl}
                        alt="medicine"
                        className="w-10 h-10 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium text-sm">
                              {medicine?.BrandName || "N/A"}
                            </p>
                            <p className="text-xs">
                              {medicine?.Generic?.GenericName ||
                                "No Generic Name"}
                            </p>
                          </div>
                          <div>
                            <button
                              onClick={() => handleDelete(item.ID)}
                              className="text-red-700 text-sm cursor-pointer hover:text-white"
                              title="Remove"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                            <p className="text-xs opacity-80 font-semibold">
                              ₱{medicine?.SellingPricePerPiece || "0"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Checkout Button */}
        {data?.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleCheckout}
              className="w-full bg-[#0070BA] text-white cursor-pointer py-2 rounded-md text-sm font-semibold hover:bg-[#005c96] transition-all"
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

















