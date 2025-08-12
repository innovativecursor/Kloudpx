"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import banner1 from "@/assets/banner1.png";
import banner2 from "@/assets/banner2.png";
import container from "@/assets/Container.png";
import container1 from "@/assets/Container (1).png";
import container2 from "@/assets/Container (2).png";

const Banners = () => {
  const cards = [
    {
      bg: "#EFF6FF",
      img: container,
      title: "Prescription Upload",
      desc: "Quick and easy upload prescription",
    },
    {
      bg: "#F0FDF4",
      img: container1,
      title: "Hassle-free Delivery",
      desc: "We provide hassle-free delivery",
    },
    {
      bg: "#F0FDFA",
      img: container2,
      title: "Free Delivery",
      desc: "On orders over ₱400",
    },
  ];

  return (
    <div className="responsive-mx lg:mt-14 md:mt-12 mt-9">
      <h1 className="font-semibold sm:text-2xl text-lg tracking-wide lg:mb-7 md:mb-5 mb-3">
        Banners
      </h1>

      <Swiper
        spaceBetween={15}
        breakpoints={{
          1024: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 18 },
          640: { slidesPerView: 1.2, spaceBetween: 15 },
          0: { slidesPerView: 1.2, spaceBetween: 12 },
        }}
      >
        {[banner1, banner2].map((banner, index) => (
          <SwiperSlide key={index}>
            <Image
              src={banner}
              alt={`Banner ${index + 1}`}
              className="w-full h-auto rounded-xl"
              priority
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Cards Section with Swiper */}
      <div className="lg:mt-24 md:mt-20 sm:mt-16 mt-11">
        <Swiper
          spaceBetween={15}
          breakpoints={{
            1024: { slidesPerView: 3, spaceBetween: 20 },
            768: { slidesPerView: 2.2, spaceBetween: 18 },
            640: { slidesPerView: 1.5, spaceBetween: 15 },
            0: { slidesPerView: 1.2, spaceBetween: 12 },
          }}
        >
          {cards.map((card, index) => (
            <SwiperSlide key={index}>
              <div
                className="flex sm:h-28 cursor-pointer h-24 items-center gap-3 sm:gap-4 border rounded-xl border-gray-100 shadow px-5 md:px-8"
                style={{ backgroundColor: card.bg }}
              >
                <Image
                  src={card.img}
                  alt={card.title}
                  className="w-12 h-12 md:w-16 md:h-16 sm:w-12 sm:h-12"
                  priority
                />
                <div className="flex flex-col tracking-wide">
                  <h1 className="font-semibold text-xs md:text-base sm:text-sm">
                    {card.title}
                  </h1>
                  <h1 className="font-light opacity-80 mt-1 sm:text-[12px] text-[11px] md:text-sm">
                    {card.desc}
                  </h1>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Banners;

