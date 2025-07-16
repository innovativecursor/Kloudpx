"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { generateSlug } from "@/app/utils/slugify";

const ProductCardItem = ({ item, fallbackImage }) => {
  const router = useRouter();
  const swiperRef = useRef(null);

  const handleCardClick = (id, genericname) => {
    const slug = generateSlug(genericname);
    router.push(`/Products/${slug}/${id}`);
  };

  const validImages = (item.images || []).filter(
    (img) => typeof img === "string" && img.trim() !== ""
  );

  const slides =
    validImages.length > 0
      ? validImages.map((url) => ({ FileName: url }))
      : [{ FileName: fallbackImage }];

  const onMouseEnter = () => {
    if (swiperRef.current && swiperRef.current.swiper && slides.length > 1) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const onMouseLeave = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(0);
    }
  };

  return (
    <div
      onClick={() => handleCardClick(item.id, item.genericname)}
      className="w-full bg-white h-[340px] rounded cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-xl overflow-hidden"
    >
      <h1 className="mx-3.5 lg:text-lg mt-4 md:text-xl text-lg font-light">
        {item.brandname}
      </h1>

      <div
        className="mt-4 px-4"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Swiper
          ref={swiperRef}
          spaceBetween={10}
          slidesPerView={1}
          loop
          allowTouchMove={true}
          style={{ width: "80%", height: "160px" }}
        >
          {slides.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full rounded overflow-hidden">
                <Image
                  src={img.FileName}
                  alt={item.brandname}
                  fill
                  className=" rounded"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex justify-between items-start mt-5 mx-3.5 mb-2">
        <div>
          <h1 className="text-xs font-medium">
            {item.category || "No Category"}
          </h1>
          <p className="text-[12px] font-light opacity-70 mt-1">
            {item.description
              ? item.description.split(" ").slice(0, 5).join(" ")
              : "No description"}
            {item.description && item.description.split(" ").length > 5 && (
              <span className="text-color"> ...more</span>
            )}
          </p>
        </div>

        <div className="flex gap-5 z-20">
          <div className="bg-white shadow-md flex items-center justify-center -mt-8 w-9 h-9 rounded-full">
            <i className="ri-whatsapp-line text-2xl text-green-600"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsCard = ({ selectedCategoryItems }) => {
  const fallbackImage = "/assets/fallback.png";
  const medicines = selectedCategoryItems || [];

  console.log(selectedCategoryItems);

  return (
    <div>
      <div className="grid lg:grid-cols-3 sm:gap-7 gap-10 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 mt-7 sm:mt-11 sm:mb-20 mb-12">
        {medicines.length > 0 ? (
          medicines.map((item) => (
            <ProductCardItem
              key={item.id}
              item={item}
              fallbackImage={fallbackImage}
            />
          ))
        ) : (
          <p className="text-center col-span-full">No products available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductsCard;
