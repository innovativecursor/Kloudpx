import React from "react";
import { AiFillProduct } from "react-icons/ai";
import { MdDeliveryDining } from "react-icons/md";
import { MdLocalOffer } from "react-icons/md";
import { FaSortAmountUp } from "react-icons/fa";
import { useCheckout } from "@/app/contexts/CheckoutContext";
import { useCartContext } from "@/app/contexts/CartContext";

const DeliveryCart = () => {
  const { checkoutData } = useCheckout();
  const items = checkoutData?.items || [];
  const { removeFromCart } = useCartContext();

  const handleDelete = (id) => {
    console.log(id);

    removeFromCart(id);
  };

  // console.log(checkoutData);

  const fallbackImage = "/assets/fallback.png";
  return (
    <div>
      <div className="bg-[#EDF4F6] w-full rounded-lg py-5">
        <div className="flex  font-semibold text-black px-6 py-3 items-center text-lg ">
          Your Cart
        </div>

        {items.map((item, index) => {
          const medicine = item.Medicine || {};
          const image = medicine.ItemImages?.[0]?.url || fallbackImage;

          const price = medicine?.price || 0;
          const discountPercent =
            parseFloat(medicine?.Discount?.replace("%", "")) || 0;
          const discountedPrice = (
            price -
            (price * discountPercent) / 100
          ).toFixed(2);

          // console.log("my price", discountPercent);

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
                    <p className="text-sm font-light text-[#0070ba]">
                      {medicine.genericname || "genericname"}
                    </p>
                    <h4 className="font-medium text-base mb-1">
                      {medicine.brandname || "brandname"}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleDelete(medicine.cart_id)}
                    className="ml-2 cursor-pointer font-light text-gray-400"
                    title="Remove"
                  >
                    <i className="ri-close-circle-line text-2xl font-light"></i>
                  </button>
                </div>

                <h4 className="font-medium text-base mb-1">
                  dis {medicine.Price || "brandname"}
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
                    <p className="text-sm font-semibold text-[#333]">
                      ₱{price}
                    </p>
                  )}
                </div>
                <span className="text-xs">Quantity: {item.Quantity || 0}</span>
              </div>
            </div>
          );
        })}

        {/* <div className="flex items-center gap-4 md:py-6 px-10 shadow-xs transition">
          <div>
            <img
              src={fallbackImage}
              alt="product"
              className="w-20 h-20 object-cover rounded-md"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <p className="text-sm font-light text-[#0070ba]">
                  Supplements Vitamins
                </p>
                <h4 className="font-medium text-base mb-1">Sugar Free Gold</h4>
              </div>
              <button
                //   onClick={() => handleDelete(item.cart_id)}
                className="ml-2 cursor-pointer font-light text-gray-400"
                title="Remove"
              >
                <i className="ri-close-circle-line text-2xl font-light"></i>
              </button>
            </div>

            <div className="text-base mt-2 font-medium text-[#333]">
              <p className="text-sm font-semibold text-[#333]">₱220</p>
            </div>
            <span className="text-xs">Quantity: 3</span>
          </div>
        </div> */}

        <div className="w-full h-[0.5px] mt-7 bg-[#0070ba]"></div>

        <div className="flex  font-semibold text-black px-6 pt-8 items-center text-base ">
          Billing Details
        </div>

        <div className="flex justify-between items-center px-6 mt-3">
          <div className="flex gap-1  items-center">
            <AiFillProduct className="text-xs" />
            <span className="text-sm font-medium">Item</span>
          </div>
          <p className="text-sm font-semibold text-[#333]">₱220</p>
        </div>

        <div className="flex justify-between items-center px-6 mt-3">
          <div className="flex gap-1  items-center">
            <MdDeliveryDining className="text-base" />
            <span className="text-sm font-medium">Delivery Change</span>
          </div>
          <p className="text-sm font-semibold text-[#333]">₱220</p>
        </div>

        <div className="flex justify-between items-center px-6 mt-3">
          <div className="flex gap-1  items-center">
            <MdLocalOffer className="text-base" />
            <span className="text-sm font-medium">Offer discount</span>
          </div>
          <p className="text-sm font-semibold text-[#333]">₱220</p>
        </div>

        <div className="flex justify-between items-center px-6 mt-3">
          <div className="flex gap-1  items-center">
            <FaSortAmountUp className="text-base" />
            <span className="text-sm font-medium">Gst</span>
          </div>
          <p className="text-sm font-semibold text-[#333]">12%</p>
        </div>

        <div className="w-full h-[0.5px] mt-7 bg-[#0070ba]"></div>
        <div className="flex justify-between pb-5 items-center px-6 mt-3">
          <span className="text-sm font-semibold">Total Amount</span>
          <p className="text-sm font-semibold text-[#333]">₱220</p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryCart;
