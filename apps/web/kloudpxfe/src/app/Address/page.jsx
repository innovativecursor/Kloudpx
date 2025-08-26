"use client";

import React, { useEffect } from "react";
import Address from "../components/AddressesTabContent/Address";

import DeliveryCart from "../components/DeliveryData/DeliveryCart";
import { useCheckout } from "../contexts/CheckoutContext";

const page = () => {
  const { checkoutData, doCheckout } = useCheckout();

  useEffect(() => {
    if (!checkoutData || checkoutData.length === 0) {
      doCheckout();
    }
  }, []);

  return (
    <div className=" pb-10 min-h-screen md:mt-52 sm:mt-48 mt-32">
      <div className="responsive-mx pt-7 md:pt-11">
        <div className="flex justify-between md:flex-row flex-col md:gap-0 gap-10 items-start">
          <div className="lg:w-[45%] md:w-[55%] w-full flex flex-col">
            <Address />
          </div>

          <div className="md:w-[40%] w-full sm:mt-12 mt-10">
            <DeliveryCart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
