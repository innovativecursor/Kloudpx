"use client";
import React from "react";
import DeliveryType from "../components/DeliveryData/DeliveryType";
import DeliveryCart from "../components/DeliveryData/DeliveryCart";
import SubTitle from "../components/Titles/SubTitle";

const page = () => {
    return (
        <div className=" pb-10 min-h-screen md:mt-52 sm:mt-48 mt-32">
            <div className="responsive-mx pt-7 md:pt-11">
                <div className="flex justify-between md:flex-row flex-col md:gap-0 gap-10 items-start">
                    <div className="lg:w-[45%] md:w-[55%] w-full flex flex-col">
                        <SubTitle
                            paths={["Cart", "Checkout", "Address", "Delivery Type"]}
                        />
                        <DeliveryType />
                    </div>

                    <div className="md:w-[40%] w-full mt-12">
                        <DeliveryCart />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;
