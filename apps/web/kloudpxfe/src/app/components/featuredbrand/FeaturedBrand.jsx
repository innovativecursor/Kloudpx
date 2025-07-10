"use client";

import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import TitleSlider from "../titleslider/TitleSlider";
import useSwiperNavigation from "@/app/hooks/useSwiperNavigation";
import { useProductContext } from "@/app/contexts/ProductContext";

const FeaturedBrand = () => {
  const { prevRef, nextRef, setSwiperInstance } = useSwiperNavigation();
  const { getBranded, branded } = useProductContext();
  const fallbackImage = "/assets/paracetamol.jpeg";
  useEffect(() => {
    if (!branded || branded.length === 0) {
      getBranded();
    }
  }, []);

  console.log(branded);

  return (
    <div className="responsive-mx mt-8 md:mt-24 bg-gray-200/70 rounded-xl sm:py-12 py-8 sm:px-6 px-4">
      <TitleSlider
        title="Featured Brands"
        prevRef={prevRef}
        nextRef={nextRef}
      />

      <Swiper
        loop={true}
        onSwiper={setSwiperInstance}
        modules={[Navigation]}
        breakpoints={{
          0: { slidesPerView: 2, spaceBetween: 10 },
          640: { slidesPerView: 3, spaceBetween: 20 },
          768: { slidesPerView: 4, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
        }}
        className="mySwiper"
      >
        {branded.map(({ images, id }, index) => (
          <SwiperSlide key={id}>
            <div className="w-full h-20 sm:h-36 lg:h-52 flex items-center justify-center bg-white rounded-lg overflow-hidden">
              <img
                src={images?.[0] || fallbackImage}
                alt={`Brand ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturedBrand;
