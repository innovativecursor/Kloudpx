import React from "react";
import Address from "../components/AddressesTabContent/Address";
// import SubTitle from "../components/Titles/SubTitle";

import DeliveryCart from "../components/DeliveryData/DeliveryCart";

const page = () => {

  return (
    <div className=" pb-10 min-h-screen md:mt-52 sm:mt-48 mt-32">
      <div className="responsive-mx pt-7 md:pt-11">
        <div className="flex justify-between md:flex-row flex-col md:gap-0 gap-10 items-start">
          <div className="md:w-[45%] w-full flex flex-col">
            {/* <SubTitle paths={["Cart", "Checkout", "Address"]} /> */}
            <Address />
          </div>

          <div className="md:w-[40%] w-full">
            <DeliveryCart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
