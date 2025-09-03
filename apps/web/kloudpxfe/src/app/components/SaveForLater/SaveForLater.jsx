"use client";
import React from "react";
import { useCheckout } from "@/app/contexts/CheckoutContext";

const SaveForLater = ({ data, setSelectedProduct }) => {
  const loading = false;
  const fallbackImage = "/assets/fallback.png";
  const { toggleSaveForLater, savedForLaterIds } = useCheckout();
  const handleSaveForLater = async (cartId) => {
    await toggleSaveForLater(cartId);
  };

  return (
    <div>
      <div className="pt-5">
        {loading ? (
          <p className="text-center text-gray-500">Loading cart...</p>
        ) : (
          <div className="space-y-4">
            {data.map((item) => {
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
                  className="w-full py-3 sm:px-6 px-3  rounded-sm cursor-pointer flex justify-between items-center bg-green-50"
                  onClick={() => setSelectedProduct(item)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={imageUrl}
                      alt="product"
                      className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs sm:text-sm truncate max-w-[140px]">
                        {medicine?.genericname || "N/A"}
                      </span>
                      <span className="text-gray-500 text-[11px] sm:text-[13px] truncate max-w-[140px]">
                        {medicine?.brandname || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {discountPercent > 0 ? (
                      <div className="text-xs sm:text-sm font-semibold text-[#333]">
                        ₱ {discountedPrice}
                        <span className="text-[10px] sm:text-xs line-through text-gray-400 ml-1">
                          ₱ {price}
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs sm:text-sm font-semibold text-[#333]">
                        ₱ {price}
                      </div>
                    )}

                    <label className="flex items-center gap-1 text-[10px] sm:text-xs cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={savedForLaterIds.includes(item.cart_id)}
                        onChange={() => handleSaveForLater(item.cart_id)}
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-blue-600 cursor-pointer checked:bg-blue-500"
                      />
                      Save for Later
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SaveForLater;
