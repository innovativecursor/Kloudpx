"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { motion } from "framer-motion";
import PrimaryButton from "../button/PrimaryButton";
import container from "@/assets/Container.png";
import container1 from "@/assets/Container (1).png";
import container2 from "@/assets/Container (2).png";
import { useImageContext } from "@/app/contexts/ImagesContext";

const Banners = () => {
  const { galleryImages, getGalleryImages } = useImageContext();

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
      title: "Secure Transactions",
      desc: "Safe and reliable payments through COD, G-Cash, PayMaya, and QRPh",
    },
    {
      bg: "#F0FDFA",
      img: container2,
      title: "Free Delivery",
      desc: "Applies to Standard Delivery with minimum purchase",
    },
  ];

  useEffect(() => {
    getGalleryImages();
  }, []);

  const allImages = Array.isArray(galleryImages?.data)
    ? galleryImages.data
    : [];

  return (
    <div className="responsive-mx md:mt-24 mt-12">
      <motion.h1
        className="font-semibold sm:text-2xl text-lg tracking-wide md:mb-4 mb-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Featured Products
      </motion.h1>

      <div className="grid grid-cols-2 md:gap-6 gap-2">
        {allImages.map((image, index) => (
          <div key={image.ID || index}>
            <div className="relative group cursor-pointer overflow-hidden rounded-xl">
              <img
                src={image.ImageURL}
                alt={image.ButtonText || `Banner ${index + 1}`}
                className="w-full h-auto object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-xl"></div>
              {(image.ButtonText || image.Link) && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {image.Link ? (
                    <a href={image.Link} rel="noreferrer">
                      <PrimaryButton title={image.ButtonText || "View"} />
                    </a>
                  ) : (
                    <PrimaryButton title={image.ButtonText || "View"} />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="md:mt-24 mt-12">
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
                className="flex sm:h-28 mb-2 cursor-pointer h-24 items-center gap-3 sm:gap-4 border rounded-xl border-gray-50 px-5 md:px-6"
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
                  <h1 className="font-light opacity-80 mt-1 sm:text-[12px] text-[11px] md:text-xs">
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
