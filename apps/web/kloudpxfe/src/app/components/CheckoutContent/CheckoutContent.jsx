import React, { useEffect } from "react";
import { useCartContext } from "@/app/contexts/CartContext";
import { useCheckout } from "@/app/contexts/CheckoutContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const CheckoutContent = ({ setSelectedProduct, cartItems }) => {
  const { token } = useAuth();
  const router = useRouter();
  const { getAllCartData } = useCartContext();
  const { toggleSaveForLater, savedForLaterIds, doCheckout } = useCheckout();
  const fallbackImage = "/assets/fallback.png";

  const data = cartItems || [];
  const loading = false;

  useEffect(() => {
    if (token) {
      getAllCartData();
    }
  }, [token]);

  const handleSaveForLater = async (cartId) => {
    await toggleSaveForLater(cartId);
  };

  const handleCheckout = async () => {
    const allItemsSavedForLater = data.every((item) =>
      savedForLaterIds.includes(item.cart_id)
    );

    if (data.length === 0 || allItemsSavedForLater) {
      toast.error(
        "No items available for checkout. Please move items back from 'Save for Later'."
      );
      return;
    }

    try {
      await doCheckout();
      router.push("/Address");
    } catch (error) {
      toast.error("Checkout failed, please try again.");
    }
  };

  return (
    <div>
      <div className="bg-[#EDF4F6] shadow-md sm:p-6 p-5 rounded-lg mb-7 mt-9">
        <h3 className="font-semibold text-center dark-text tracking-wider sm:text-base text-sm dark-text">
          {data.length} item{data.length !== 1 && "s"} in your cart
        </h3>
      </div>

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
                className="w-full py-3 sm:px-6 px-3 rounded-sm cursor-pointer flex justify-between items-center bg-green-50"
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
            className={`bg-[#0070BA] text-white hover:bg-[#005c96] sm:text-[11px] text-[8px] w-full py-3 rounded-full font-semibold ${
              data.length === 0 ||
              data.every((item) => savedForLaterIds.includes(item.cart_id))
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={
              data.length === 0 ||
              data.every((item) => savedForLaterIds.includes(item.cart_id))
                ? null
                : handleCheckout
            }
            disabled={
              data.length === 0 ||
              data.every((item) => savedForLaterIds.includes(item.cart_id))
            }
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutContent;
