"use client";
import React from "react";
import { MdOutlineBackup } from "react-icons/md";
import { IoQrCodeOutline } from "react-icons/io5";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const Upload = () => {
  return (
    <div className="responsive-mx md:mt-20 sm:mt-16 mt-9">
      <Swiper
        spaceBetween={20}
        slidesPerView={1.2}
        breakpoints={{
          640: {
            slidesPerView: 1.5,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 2,
          },
        }}
      >
        {/* Upload Prescription Card */}
        <SwiperSlide>
          <div className="bg-[#EBF7FF] border border-[#0070ba] rounded-3xl sm:h-80 h-64 lg:p-8 md:p-6 p-4 flex flex-col items-center justify-center text-center">
            <div className="bg-[#0070ba] rounded-full tracking-wide sm:p-4 p-2 mb-4">
              <MdOutlineBackup className="text-white sm:text-2xl text-xl" />
            </div>
            <h3 className="font-semibold sm:text-sm text-xs mb-2 text-black">
              Upload Prescription and get 3% Discount
            </h3>
            <p className="text-[#0070ba] font-medium sm:text-xs text-[9px]">
              Upload Your Prescription and get 3% instant Discount on all your
              Medicines.
            </p>

            <button className="bg-[#0070ba] text-white mt-4 px-8 sm:py-3 py-2.5 rounded-full sm:text-sm text-xs transition">
              Upload Now
            </button>
          </div>
        </SwiperSlide>

        {/* QR Code Payment Card */}
        <SwiperSlide>
          <div className="bg-[#EBF7FF] border lg:mr-1 border-[#0070ba] rounded-3xl sm:h-80 h-64 lg:p-8 md:p-6 p-4 flex flex-col items-center justify-center text-center">
            <div className="bg-[#0070ba] rounded-full tracking-wide sm:p-4 p-2 mb-4">
              <IoQrCodeOutline className="text-white sm:text-2xl text-xl" />
            </div>
            <h3 className="font-semibold sm:text-sm text-xs mb-2 text-black">
              Save this QR for easy Payments
            </h3>
            <p className="text-[#0070ba] font-medium sm:text-xs text-[9px]">
              Pay via this QR Code and get Instant Discounts
            </p>
            <span className="text-[#0070ba] font-medium sm:text-xs text-[9px]">
              or Cashbacks
            </span>

            <button className="bg-[#0070ba] text-white mt-4 px-8 sm:py-3 py-2.5 rounded-full sm:text-sm text-xs transition">
              Get QR code
            </button>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Upload;
