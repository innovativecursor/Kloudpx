
"use client";
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import PrimaryButton from "../button/PrimaryButton"; 
import { useImageContext } from "@/app/contexts/ImagesContext";

const Banners = () => {
  const { galleryImages, getGalleryImages } = useImageContext();

  useEffect(() => {
    getGalleryImages();
  }, []);

  const allImages = Array.isArray(galleryImages?.data)
    ? galleryImages.data
    : [];

  return (
    <div className="responsive-mx lg:mt-14 md:mt-12 mt-9">
      <h1 className="font-semibold sm:text-2xl text-lg tracking-wide lg:mb-7 md:mb-5 mb-3">
        Featured Products
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
        {allImages.map((image, index) => (
          <SwiperSlide key={image.ID || index}>
            <div className="relative group overflow-hidden rounded-xl">
              <img
                src={image.ImageURL}
                alt={image.ButtonText || `Banner ${index + 1}`}
                className="w-full h-auto object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-xl"></div>
              {(image.ButtonText || image.Link) && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {image.Link ? (
                    <a href={image.Link} target="_blank" rel="noreferrer">
                      <PrimaryButton title={image.ButtonText || "View"} />
                    </a>
                  ) : (
                    <PrimaryButton title={image.ButtonText || "View"} />
                  )}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banners;
