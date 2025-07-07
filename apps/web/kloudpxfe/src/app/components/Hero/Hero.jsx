"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "./Hero.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import PrimaryButton from "@/app/components/button/PrimaryButton";
import Prescription from "@/app/components/modal/Prescription";
import { useImageContext } from "@/app/contexts/ImagesContext";

export default function Hero() {
  const { carousel } = useImageContext();
  const [isHeroPart, setIsHeroPart] = useState(false);

  useEffect(() => {
    setIsHeroPart(true);
  }, []);

  console.log(carousel);

  return (
    <div className="responsive-mx mt-8 md:mt-10">
      {isHeroPart && carousel?.data?.length > 0 && (
        <Swiper
          loop={true}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {carousel.data.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative">
                <img
                  src={slide.ImageURL}
                  alt={slide.title1 || "Carousel Slide"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1/2 sm:left-24 left-10 transform -translate-y-1/2 text-white font-semibold md:text-5xl sm:text-3xl text-sm tracking-wide">
                  <p>{slide.title1}</p>
                  <p className="md:mt-2">{slide.title2}</p>

                  {slide.features?.map(({ icon, text }, index) => (
                    <div
                      key={index}
                      className="flex md:mt-5 sm:mt-3 mt-1 justify-start sm:gap-3 gap-2 items-center"
                    >
                      <div className="sm:w-5 sm:h-5 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                        <i
                          className={`${icon} text-gray-500 font-light sm:text-xs text-[8px]`}
                        ></i>
                      </div>
                      <span className="font-normal sm:text-sm text-[9px]">
                        {text}
                      </span>
                    </div>
                  ))}

                  {/* <PrimaryButton title="Shop Now" className="sm:mt-4 mt-1" /> */}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <div className="flex items-center justify-center gap-4 sm:text-xs text-[9px] tracking-wider text-gray-600 sm:mt-9 mt-4">
        <div className="flex-grow h-px bg-gray-300"></div>
        PLACE YOUR ORDER VIA
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      <Prescription />
    </div>
  );
}
