"use client";
import React from "react";

const Qr = ({ deliveryData }) => {
  const qr = "/assets/qr.png";

  return (
    <div>
      <div className="flex justify-between md:flex-row flex-col items-start gap-6">
        {/* Left: Payment Info */}
        <div className="flex-1">
          <h2 className="font-semibold tracking-wide text-2xl text-[#00243f] mb-2">
            Pay via Gcash
          </h2>
          <span className="text-[#00243f] text-2xl mb-1 font-light">
            Payable amount
          </span>
          <h1 className="text-[#0070BA] mt-3 text-3xl font-normal mb-6">
            ₱{deliveryData?.grand_total?.toFixed(2)}
          </h1>
        </div>

        {/* Right: QR Image */}
        <div className="bg-white  p-2 rounded-lg shadow-md flex justify-center items-center max-w-xs w-full">
          <img
            src={qr}
            alt="QR Code"
            className="object-contain lg:h-80 lg:w-96 md:w-72 md:h-60"
          />
        </div>
      </div>
    </div>
  );
};

export default Qr;
