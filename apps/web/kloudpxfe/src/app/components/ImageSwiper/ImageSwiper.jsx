"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ImageSwiper = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const fallbackImage = "/assets/fallback.png";

  useEffect(() => {
    setIsClient(true);
  }, []);

  const safeImages =
    images?.filter((img) => typeof img === "string" && img.trim() !== "") || [];
  const displayImages = safeImages.length ? safeImages : [fallbackImage];

  const onThumbsSwiperInit = (swiper) => {
    setThumbsSwiper(swiper);
    if (prevRef.current && nextRef.current) {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation.init();
      swiper.navigation.update();
    }
  };

  const SafeImage = ({ src, alt, className }) => (
    <Image
      src={src || fallbackImage}
      alt={alt}
      width={200}
      height={80}
      className={className}
      style={{ objectFit: "contain" }}
    />
  );

  return (
    <div className="md:w-[50%]">
      {/* Main Swiper */}
      <div className="relative rounded-xl">
        <div className="flex flex-col pb-4 justify-center items-center bg-[#F4F8FB] pt-4 shadow-md w-full h-full">
          <Swiper
            spaceBetween={10}
            navigation={false}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[Navigation, Thumbs]}
            className="w-full h-full"
          >
            {displayImages.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="flex justify-center items-center w-full sm:h-[70vh] h-[50vh] p-4 bg-white">
                  {isClient ? (
                    <Zoom>
                      <Image
                        src={img || fallbackImage}
                        alt={`product-${index}`}
                        width={600}
                        height={500}
                        style={{ objectFit: "contain", maxHeight: "70vh" }}
                      />
                    </Zoom>
                  ) : (
                    <Image
                      src={img || fallbackImage}
                      alt={`product-${index}`}
                      width={600}
                      height={500}
                      style={{ objectFit: "contain", maxHeight: "70vh" }}
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Thumbnail Swiper with navigation buttons */}
      <div className="mt-6 relative">
        <div className="flex items-center justify-between px-2">
          <button
            ref={prevRef}
            className="bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center z-10"
            aria-label="Previous thumbnails"
          >
            <i className="ri-arrow-left-s-line text-xl"></i>
          </button>

          {isClient && (
            <Swiper
              onSwiper={onThumbsSwiperInit}
              spaceBetween={10}
              slidesPerView={4}
              watchSlidesProgress
              modules={[Navigation, Thumbs]}
              breakpoints={{
                0: { slidesPerView: 3 },
                640: { slidesPerView: 4 },
              }}
              className="w-full mx-2"
            >
              {displayImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <SafeImage
                    src={img}
                    alt={`thumb-${index}`}
                    className="w-[200px] h-[80px] object-contain p-1 bg-white cursor-pointer rounded-md border border-[#0070ba] transition-all duration-300"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          <button
            ref={nextRef}
            className="bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center z-10"
            aria-label="Next thumbnails"
          >
            <i className="ri-arrow-right-s-line text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageSwiper;
