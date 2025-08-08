import React, { useEffect } from "react";
import { useCheckout } from "@/app/contexts/CheckoutContext";
import { useCartContext } from "@/app/contexts/CartContext";
import BillingDetails from "./BillingDetails";

const DeliveryCart = () => {
  const { checkoutData, deliveryData } = useCheckout();
  const items = checkoutData?.items || [];
  const { removeFromCart } = useCartContext();
  const fallbackImage = "/assets/fallback.png";

  const handleDelete = (id) => {
    removeFromCart(id);
  };

  useEffect(() => {}, [deliveryData]);

  // console.log("Delivery Data updated:", items);

  return (
    <div>
      <div className="bg-[#EDF4F6] w-full rounded-lg py-5">
        <div className="flex font-semibold text-black px-6 py-3 items-center text-lg">
          Your Cart
        </div>

        {items.map((item, index) => {
          const medicine = item.medicine || {};
          // const image = medicine.images?.[0]?.url || fallbackImage;

          const image =
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
              key={index}
              className="flex items-center gap-4 md:py-6 px-10 shadow-xs transition"
            >
              <div>
                <img
                  src={image}
                  alt="product"
                  className="w-20 h-20 object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h1 className="text-sm font-medium text-[#0070ba]">
                      {medicine.generic_name || "Generic Name"}
                    </h1>
                    <h4 className="font-light text-sm mb-1">
                      {medicine.brand_name || "Brand Name"}
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
                    <span className="text-sm font-semibold text-[#333]">
                      ₱{price}
                    </span>
                  )}
                </div>
                <span className="text-xs">Quantity: {item.quantity || 0}</span>
              </div>
            </div>
          );
        })}

        {deliveryData?.delivery_type && (
          <BillingDetails deliveryData={deliveryData} />
        )}
      </div>
    </div>
  );
};

export default DeliveryCart;
