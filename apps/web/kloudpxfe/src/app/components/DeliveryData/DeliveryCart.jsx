"use client";

import React, { useEffect } from "react";
import { useCheckout } from "@/app/contexts/CheckoutContext";
import { useCartContext } from "@/app/contexts/CartContext";
import BillingDetails from "./BillingDetails";

const DeliveryCart = () => {
  const { checkoutData, deliveryData, doCheckout } = useCheckout();
  const { removeFromCart } = useCartContext();
  const items = checkoutData?.items || [];
  const fallbackImage = "/assets/fallback.png";

  useEffect(() => {
    doCheckout();
  }, []);

  const handleDelete = (id) => {
    removeFromCart(id);
  };

  if (deliveryData?.delivery_type) {
    return (
      <div className="bg-[#EDF4F6] w-full rounded-lg py-5">
        <div className="flex font-semibold text-black px-6 py-3 items-center text-lg border-b border-gray-200">
          Billing Details
        </div>
        <BillingDetails deliveryData={deliveryData} />
      </div>
    );
  }

  return (
    <div className="bg-[#EDF4F6] w-full rounded-lg py-5">
      {items.length > 0 && (
        <>
          <div className="flex font-semibold text-black px-6 py-3 items-center text-lg border-b border-gray-200">
            Your Cart
          </div>
          {items.map((item, index) => {
            const medicine = item.medicine || {};
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
                className="flex items-center gap-4 md:py-4 px-6 border-b border-gray-200"
              >
                <div>
                  <img
                    src={image}
                    alt={medicine.generic_name || "Product"}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-sm font-medium text-[#0070ba]">
                    {medicine.generic_name || "Generic Name"}
                  </h1>
                  <h4 className="font-light text-sm mb-1">
                    {medicine.brand_name || "Brand Name"}
                  </h4>
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
                  <span className="text-xs">
                    Quantity: {item.quantity || 0}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(item.cart_id)}
                  className="ml-2 cursor-pointer font-light text-gray-400"
                  title="Remove"
                >
                  <i className="ri-close-circle-line text-2xl font-light"></i>
                </button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default DeliveryCart;
