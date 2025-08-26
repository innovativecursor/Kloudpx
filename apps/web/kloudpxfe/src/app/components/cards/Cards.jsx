"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import TitleSlider from "../titleslider/TitleSlider";
import AddToCart from "../button/AddToCart";
import DetailsCard from "./DetailsCard";
import useSwiperNavigation from "@/app/hooks/useSwiperNavigation";
import { usePrescriptionContext } from "@/app/contexts/PrescriptionContext";
import Prescription from "../modal/Prescription";
import useProductNavigation from "@/app/hooks/useProductNavigation";

const SwiperSlider = ({ data, title }) => {
  const { prevRef, nextRef, setSwiperInstance } = useSwiperNavigation();
  const { goToProductPage } = useProductNavigation();
  const fallbackImage = "/assets/fallback.png";
  const { isOpen } = usePrescriptionContext();

  return (
    <>
      <div className="responsive-mx ">
        <TitleSlider title={title} prevRef={prevRef} nextRef={nextRef} />

        <Swiper
          loop={true}
          onSwiper={setSwiperInstance}
          modules={[Navigation]}
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 10 },
            640: { slidesPerView: 3, spaceBetween: 20 },
            768: { slidesPerView: 4, spaceBetween: 20 },
            1024: { slidesPerView: 5, spaceBetween: 30 },
          }}
          className="mySwiper"
        >
          {data.map((product) => (
            <SwiperSlide key={product.id}>
              <div className=" md:h-[350px] bg-white h-[300px] flex flex-col justify-between">
                <div
                  onClick={() =>
                    goToProductPage(product?.id, product?.genericname)
                  }
                  className="bg-[#F6F5FA] cursor-pointer sm:py-5 px-5 p-4 sm:h-72 h-44 rounded-md flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={product.images?.[0] || fallbackImage}
                    alt={product.genericname || "Product Image"}
                    className="object-contain h-full w-full"
                  />
                </div>

                {/* Product details */}
                <div
                  onClick={() =>
                    goToProductPage(product?.id, product?.genericname)
                  }
                  className="md:mt-3 mt-1 px-2 cursor-pointer"
                >
                  <DetailsCard product={product} />
                </div>

                {/* Add to Cart */}
                <div className="md:mt-3 mt-1  px-2 pb-2">
                  <AddToCart
                    title="Add To Cart"
                    productDetails={product}
                    className="md:text-xs text-[10px] flex items-center gap-3 rounded-full font-medium py-1.5 justify-center text-black bg-[#EDF4F6] cursor-pointer w-full"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {isOpen && <Prescription />}
      </div>
    </>
  );
};

export default SwiperSlider;
