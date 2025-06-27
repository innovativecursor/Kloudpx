"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const ImageSwiper = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const fallbackImage = "/assets/demo.jpg";
  return (
    <div className="md:w-1/2">
      <div className="relative rounded-xl overflow-hidden ">
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold z-10">
          10% OFF
        </div>

        <Swiper
          spaceBetween={10}
          navigation={false}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[Navigation, Thumbs]}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <Image
                // src={img}
                 src={fallbackImage}
                alt={`product-${index}`}
                width={300}
                height={300}
                quality={100}
                className="w-full sm:h-[450px] h-[350px] object-contain bg-white py-10"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="mt-6 relative">
        <div className="flex items-center justify-between px-2">
          <button
            className="bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center z-10"
            id="thumb-prev"
          >
            <i className="ri-arrow-left-s-line text-xl"></i>
          </button>

          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            watchSlidesProgress
            navigation={{
              nextEl: "#thumb-next",
              prevEl: "#thumb-prev",
            }}
            modules={[Navigation, Thumbs]}
            breakpoints={{
              0: {
                slidesPerView: 3,
              },
              640: {
                slidesPerView: 4,
              },
            }}
            className="w-full mx-2"
          >
            {images.map((img, index) => (
              <SwiperSlide key={index}>
                <Image
                  // src={img}
                   src={fallbackImage}
                  alt={`thumb-${index}`}
                  width={120}
                  height={120}
                  quality={100}
                  className="w-[100px] h-[80px] object-contain p-2 bg-white cursor-pointer rounded-md border border-[#0070ba] transition-all duration-300"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            className="bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center z-10"
            id="thumb-next"
          >
            <i className="ri-arrow-right-s-line text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageSwiper;
