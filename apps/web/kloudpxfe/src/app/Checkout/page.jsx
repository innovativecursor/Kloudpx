"use client";

import React from "react";
import SubTitle from "../components/Titles/SubTitle";
import CheckoutContent from "../components/CheckoutContent/CheckoutContent";
import CheckoutProduct from "../components/CheckoutContent/CheckoutProduct";

const page = () => {
  return (
    <div className=" pb-10 min-h-screen md:mt-52 sm:mt-48 mt-32">
      <div className="responsive-mx pt-7 md:pt-11">
        <div className="flex justify-between md:flex-row flex-col md:gap-0 gap-10 items-start">
          <div className="md:w-[45%] w-full flex flex-col">
            <SubTitle paths={["Cart", "Checkout"]} />
            <CheckoutContent />
          </div>
          <div className="md:w-[40%] w-full">
            <CheckoutProduct />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
