"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "./Hero.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useImageContext } from "@/app/contexts/ImagesContext";

export default function Hero() {
  const { carousel, getCarousel } = useImageContext();
  const [isHeroPart, setIsHeroPart] = useState(false);

  useEffect(() => {
    setIsHeroPart(true);
  }, []);

  useEffect(() => {
    getCarousel();
  }, []);

  return (
    <div className="responsive-mx mt-8 md:mt-10">
      {isHeroPart && carousel?.length > 0 ? (
        <Swiper
          loop={true}
          pagination={{ clickable: true }}
          navigation={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[Pagination, Navigation, Autoplay]}
          className="mySwiper"
        >
          {carousel.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full overflow-hidden rounded-md">
                <img
                  src={slide.ImageURL}
                  alt={slide.title1 || "Carousel Slide"}
                  className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] object-center"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] flex items-center justify-center border rounded-md text-gray-500 text-sm sm:text-base bg-gray-50">
          🚫 No Banner Available
        </div>
      )}

      <div className="flex items-center justify-center gap-4 sm:text-xs text-[9px] tracking-wider text-gray-600 sm:mt-9 mt-4">
        <div className="flex-grow h-px bg-gray-300"></div>
        PLACE YOUR ORDER VIA
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>
    </div>
  );
}
