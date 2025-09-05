"use client";

import React, { useEffect } from "react";
import NewAddress from "../components/AddressesTabContent/NewAddress";
import DeliveryCart from "../components/DeliveryData/DeliveryCart";
import { useCheckout } from "../contexts/CheckoutContext";
import SubTitle from "../components/Titles/SubTitle";

const page = () => {
  const { checkoutData, doCheckout } = useCheckout();

  useEffect(() => {
    if (!checkoutData || checkoutData.length === 0) {
      doCheckout();
    }
  }, []);

  return (
    <>
      <div className=" pb-10 min-h-screen md:mt-52 sm:mt-48 mt-32">
        <div className="responsive-mx pt-7 md:pt-11">
          <div className="flex justify-between md:flex-row flex-col md:gap-0 gap-10 items-start">
            <div className="flex flex-col lg:w-[45%] md:w-[55%] ">
              <SubTitle
                paths={["Cart", "Checkout", "Address", "New Address"]}
              />
              <NewAddress />
            </div>
            <div className="md:w-[40%] w-full sm:mt-12 mt-10">
              <DeliveryCart fetchCheckout={false} showBilling={false} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
