import React from "react";

const CheckoutContent = () => {
  return (
    <div>
      <div className="bg-[#EDF4F6] shadow-md sm:p-6 p-5 rounded-lg mb-7 mt-9">
        <h3 className="font-semibold text-center dark-text tracking-wider sm:text-base text-sm dark-text">
          2 items in your cart
        </h3>
      </div>

      <div className="space-y-4">
        <div className="bg-green-300 w-full py-3 px-6 rounded-sm flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <img
              src="/assets/fallback.png"
              className="sm:w-12 sm:h-12 w-8 h-8"
            />
            <div className="flex flex-col">
              <h1 className="font-light sm:text-[11px] text-[9px]">
                Supplements
              </h1>
              <h1 className="font-semibold sm:text-base text-xs">
                Magnesium Plus{" "}
              </h1>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="font-medium sm:text-base text-xs">₱400.00</h1>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                className="appearance-none bg-transparent border border-[#0070ba] cursor-pointer rounded-full sm:w-4 sm:h-4 w-2 h-2 checked:bg-blue-500"
              />
              <label className="text-[9px]">Save for Later</label>
            </div>
          </div>
        </div>
        <div className="bg-green-300 w-full py-3 px-6 rounded-sm flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <img
              src="/assets/fallback.png"
              className="sm:w-12 sm:h-12 w-8 h-8"
            />
            <div className="flex flex-col">
              <h1 className="font-light sm:text-[11px] text-[9px]">
                Supplements
              </h1>
              <h1 className="font-semibold sm:text-base text-xs">
                Magnesium Plus{" "}
              </h1>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="font-medium sm:text-base text-xs">₱400.00</h1>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                className="appearance-none bg-transparent border border-[#0070ba] cursor-pointer rounded-full sm:w-4 sm:h-4 w-2 h-2 checked:bg-blue-500"
              />
              <label className="text-[9px]">Save for Later</label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-5 sm:mt-10 mt-8 items-center">
        <div className=" w-[40%]  ">
          <button
            className="bg-[#0070BA]/10 text-black hover:bg-[#005c96]/50 w-full py-3 rounded-full font-light 
          sm:text-[11px] text-[8px] cursor-pointer"
          >
            Continue to Shop 
          </button>
        </div>
        <div className=" w-[60%]  ">
          <button className="bg-[#0070BA] text-white hover:bg-[#005c96]  sm:text-[11px] text-[8px]  w-full py-3 rounded-full font-semibold cursor-pointer">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutContent;