"use client";
import React, { useEffect } from "react";
import { useCartContext } from "@/app/contexts/CartContext";
import { useCheckout } from "@/app/contexts/CheckoutContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const CheckoutContent = () => {
  const { token } = useAuth();
  const router = useRouter();
  const { getCartData, getAllCartData } = useCartContext();
  const { toggleSaveForLater, savedForLaterIds, doCheckout } = useCheckout();
  const fallbackImage = "/assets/fallback.png";

  const data = getCartData?.data || [];
  const loading = getCartData?.loading || false;

  useEffect(() => {
    if (token) {
      getAllCartData();
    }
  }, [token]);

  const handleSaveForLater = async (cartId) => {
    await toggleSaveForLater(cartId);
  };

  const handleCheckout = async () => {
    try {
      await doCheckout();
      router.push("/Address");
    } catch (error) {
      toast.error("Checkout failed, please try again.");
    }
  };

  const itemCount = data?.length || 0;

  return (
    <div>
      <div className="bg-[#EDF4F6] shadow-md sm:p-6 p-5 rounded-lg mb-7 mt-9">
        <h3 className="font-semibold text-center dark-text tracking-wider sm:text-base text-sm dark-text">
          {itemCount} item{itemCount !== 1 && "s"} in your cart
        </h3>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading cart...</p>
      ) : (
        <div className="space-y-4">
          {data?.map((item) => {
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

            const bgClass = isUnsettled
              ? "bg-gray-200 opacity-60 pointer-events-none"
              : isRejected
              ? "bg-red-100 border border-red-400"
              : "bg-green-50";

            return (
              <div
                key={item.cart_id}
                className={`w-full py-3 px-6 rounded-sm flex justify-between  items-center ${bgClass}`}
              >
                <div className="flex gap-2 items-center">
                  <img
                    src={imageUrl}
                    alt="product"
                    className="sm:w-12 sm:h-12 w-8 h-8 object-cover rounded"
                  />
                  <div className="flex flex-col">
                    <h1 className="font-light sm:text-[11px] text-[9px]">
                      {medicine?.genericname || "N/A"}
                    </h1>
                    <h1 className="font-semibold sm:text-base text-xs">
                      {medicine?.brandname || "N/A"}
                    </h1>

                    {isUnsettled && (
                      <p className="text-[10px] text-red-600">
                        Waiting for pharmacist approval
                      </p>
                    )}
                    {isRejected && (
                      <p className="text-[10px] text-red-600">
                        Rejected by pharmacist
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <h1 className="font-medium sm:text-base text-xs">
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
                  </h1>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={savedForLaterIds.includes(item.cart_id)}
                      onChange={() => handleSaveForLater(item.cart_id)}
                      className="appearance-none bg-transparent border border-[#0070ba] cursor-pointer rounded-full sm:w-4 sm:h-4 w-2 h-2 checked:bg-blue-500"
                    />
                    <label className="text-[9px]">Save for Later</label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-between gap-5 sm:mt-10 mt-8 items-center">
        <div className="w-[40%]">
          <button
            className="bg-[#0070BA]/10 text-black hover:bg-[#005c96]/50 w-full py-3 rounded-full font-light sm:text-[11px] text-[8px] cursor-pointer"
            onClick={() => router.push("/")}
          >
            Continue to Shop
          </button>
        </div>
        <div className="w-[60%]">
          <button
            className="bg-[#0070BA] text-white hover:bg-[#005c96] sm:text-[11px] text-[8px] w-full py-3 rounded-full font-semibold cursor-pointer"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutContent;
