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

  useEffect(() => {
    getCarousel();
  }, []);

  return (
    <div className="responsive-mx mt-8 md:mt-64">
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
                className="w-full h-full rounded-md"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
