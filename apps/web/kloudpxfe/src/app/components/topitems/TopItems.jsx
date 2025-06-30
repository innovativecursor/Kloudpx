"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import useSwiperNavigation from "@/app/hooks/useSwiperNavigation";
import Link from "next/link";

const TopItems = () => {
  const { prevRef, nextRef, setSwiperInstance } = useSwiperNavigation();

  const items = [
    { image: "/assets/medicine.png", name: "Medicines" },
    { image: "/assets/percare.png", name: "Personal Care" },
    { image: "/assets/healthcare.png", name: "Healthcare Devices" },
    { image: "/assets/baby.png", name: "Baby" },
    { image: "/assets/vita.png", name: "Vitamins & Supplements" },
    { image: "/assets/pets.png", name: "Pets" },
    { image: "/assets/herbs.png", name: "Herbs" },
    { image: "/assets/medicine.png", name: "Medicines" },
    { image: "/assets/percare.png", name: "Personal Care" },
  ];

  return (
    <div className="w-full">
      <Swiper
        loop={true}
        modules={[Navigation]}
        onSwiper={setSwiperInstance}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        spaceBetween={15}
        breakpoints={{
          0: { slidesPerView: 2.5 },
          640: { slidesPerView: 4 },
          768: { slidesPerView: 5 },
          1024: { slidesPerView: 7 },
        }}
        className="w-full"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <Link href="/Products">
              <div className="flex cursor-pointer hover:text-[#0070ba]  transition-all duration-300 ease-in-out gap-2 items-center justify-center whitespace-nowrap z-[999]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="sm:w-8 sm:h-8 w-5 h-5 object-contain"
                />
                <p className="sm:text-xs text-[11px] font-medium tracking-wide">
                  {item.name}
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TopItems;
