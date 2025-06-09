"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "./Hero.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import PrimaryButton from "@/app/components/button/PrimaryButton";

const slidesData = [
  {
    id: 1,
    image: "/assets/hero.png",
    title1: "Flat 30% off",
    title2: "on Medicine Order",
    features: [
      { icon: "ri-gift-line", text: "Free Delivery" },
      { icon: "ri-truck-line", text: "Win Daily Rewards" },
    ],
  },
  {
    id: 2,
    image: "/assets/hero.png",
    title1: "Flat 30% off",
    title2: "on Medicine Order",
    features: [
      { icon: "ri-gift-line", text: "Free Delivery" },
      { icon: "ri-truck-line", text: "Win Daily Rewards" },
    ],
  },
  {
    id: 3, // 🔧 Fixed duplicate ID
    image: "/assets/hero.png",
    title1: "Flat 30% off",
    title2: "on Medicine Order",
    features: [
      { icon: "ri-gift-line", text: "Free Delivery" },
      { icon: "ri-truck-line", text: "Win Daily Rewards" },
    ],
  },
];

export default function Hero() {
  const [isHeroPart, setIsHeroPart] = useState(false);

  useEffect(() => {
    setIsHeroPart(true);
  }, []);

  return (
    <div className="responsive-mx">
      {isHeroPart && (
        <Swiper
          loop={true}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {slidesData.map(({ id, image, title1, title2, features }) => (
            <SwiperSlide key={id}>
              <div className="relative">
                <img src={image} alt={`Slide ${id}`} className="w-full h-full object-cover" />

                <div className="absolute top-1/2 sm:left-24 left-10 transform -translate-y-1/2 text-white font-semibold md:text-5xl sm:text-3xl text-sm tracking-wide">
                  <p>{title1}</p>
                  <p className="md:mt-2">{title2}</p>

                  {features.map(({ icon, text }, index) => (
                    <div
                      key={index}
                      className="flex md:mt-5 sm:mt-3 mt-1 justify-start sm:gap-3 gap-2 items-center"
                    >
                      <div className="sm:w-5 sm:h-5 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                        <i className={`${icon} text-gray-500 font-light sm:text-xs text-[8px]`}></i>
                      </div>
                      <span className="font-normal sm:text-sm text-[9px]">{text}</span>
                    </div>
                  ))}
                  <PrimaryButton title="Shop Now" className="sm:mt-4 mt-1" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}


      <div className="flex items-center justify-center gap-4 sm:text-xs text-[9px] tracking-wider text-gray-600 sm:mt-8 mt-4">
        <div className="flex-grow h-px bg-gray-300"></div>
        PLACE YOUR ORDER VIA
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>


    </div>
  );
}




