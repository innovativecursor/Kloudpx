'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import useSwiperNavigation from '@/hooks/useSwiperNavigation';

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
        breakpoints={{
          0: { slidesPerView: 2, spaceBetween: 10 },
          640: { slidesPerView: 5, spaceBetween: 15 },
          768: { slidesPerView: 6, spaceBetween: 20 },
          1024: { slidesPerView: 7, spaceBetween: 0 },
        }}
        className="w-full"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="flex gap-1 items-center justify-center p-2">
              <img src={item.image} alt={item.name} className="w-6 h-6 object-contain" />
              <p className="text-[10px] font-medium text-center">{item.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TopItems;
