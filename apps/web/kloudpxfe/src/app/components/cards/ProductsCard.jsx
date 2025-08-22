"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import AddToCart from "../button/AddToCart";
import { usePrescriptionContext } from "@/app/contexts/PrescriptionContext";
import Prescription from "../modal/Prescription";
import useProductNavigation from "@/app/hooks/useProductNavigation";

const ProductCardItem = ({ item, fallbackImage }) => {
  const router = useRouter();
  const swiperRef = useRef(null);
  const { goToProductPage } = useProductNavigation();

  const validImages = (item.images || []).filter(
    (img) => typeof img === "string" && img.trim() !== ""
  );

  const slides =
    validImages?.length > 0
      ? validImages.map((url) => ({ FileName: url }))
      : [{ FileName: fallbackImage }];

  const onMouseEnter = () => {
    if (swiperRef.current && swiperRef.current.swiper && slides?.length > 1) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const onMouseLeave = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(0);
    }
  };

  return (
    <div
      className="w-full sm:h-[380px]  h-[240px]  bg-white rounded-xl border-2 border-gray-100 
      md:shadow-[0_8px_15px_-6px_rgba(0,0,0,0.5)] shadow-[0_2px_6px_-3px_rgba(0,0,0,0.4)] cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-xl overflow-hidden"
    >
      <div onClick={() => goToProductPage(item.id, item.genericname)}>
        <div
          className="relative  sm:h-64  flex items-center justify-center h-36 px-4 shadow bg-[#F6F5FA]"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-[#002046] text-white sm:text-[10px] text-[8px] sm:px-5 px-3 py-[2px] lg:py-[5px] sm:py-[4px]  rounded-b-xl  z-10 shadow-lg">
            {item?.discount}
          </div>

          <Swiper
            ref={swiperRef}
            spaceBetween={10}
            slidesPerView={1}
            loop
            allowTouchMove={true}
            // style={{ width: "80%", height: "160px" }}
            className="sm:w-[80%] sm:h-[160px] w-[95%] h-[100px]"
          >
            {slides.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full rounded overflow-hidden">
                  <Image
                    src={img.FileName}
                    alt={item.brandname}
                    fill
                    className=" rounded"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-3 mx-3.5">
          <h1 className="sm:text-[12px] text-[10px] text-color font-light">
            {(item?.genericname?.slice(0, 22) || "No genericname") +
              (item?.genericname?.length > 22 ? "..." : "")}
          </h1>

          <span className="sm:text-[13px] text-[11px] font-medium tracking-wide mt-2">
            {(item?.brandname?.slice(0, 25) || "No brandname") +
              (item?.brandname?.length > 25 ? "..." : "")}
          </span>
        </div>
      </div>

      <div className=" mx-3.5 mb-2">
        <div className="flex justify-between sm:mt-3 mt-2 pb-2 items-center">
          <span className="font-semibold sm:text-base text-sm">
            ₱
            {(
              item?.price -
              (item?.price * (parseFloat(item?.discount) || 0)) / 100
            ).toFixed(2)}
          </span>

          <AddToCart
            title="Add To Cart"
            productDetails={item}
            className="md:text-xs text-[9px] flex items-center gap-1 rounded-full font-medium sm:px-5 px-3 py-1.5 justify-center text-white bg-[#0070ba] cursor-pointer "
          />
        </div>
      </div>
    </div>
  );
};

const ProductsCard = ({ selectedCategoryItems }) => {
  const fallbackImage = "/assets/fallback.png";
  const medicines = selectedCategoryItems || [];
  const { isOpen } = usePrescriptionContext();
  // console.log(selectedCategoryItems);

  return (
    <div>
      <div className="grid lg:grid-cols-4 lg:gap-5 space-y-7 md:space-y-10 sm:gap-10 gap-3 grid-cols-2 sm:mt-5 ">
        {medicines?.length > 0
          ? medicines.map((item) => (
              <ProductCardItem
                key={item.id}
                item={item}
                fallbackImage={fallbackImage}
              />
            ))
          : null}
      </div>
      {isOpen && <Prescription />}
    </div>
  );
};

export default ProductsCard;
