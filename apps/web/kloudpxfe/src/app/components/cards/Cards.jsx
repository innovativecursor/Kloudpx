"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import TitleSlider from "../titleslider/TitleSlider";
import AddToCart from "../button/AddToCart";
import DetailsCard from "./DetailsCard";
import useSwiperNavigation from "@/app/hooks/useSwiperNavigation";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/app/utils/slugify";
import { usePrescriptionContext } from "@/app/contexts/PrescriptionContext";
import Prescription from "../modal/Prescription";

const SwiperSlider = ({ data, title }) => {
  const router = useRouter();
  const { prevRef, nextRef, setSwiperInstance } = useSwiperNavigation();
  const fallbackImage = "/assets/fallback.png";
  const { isOpen } = usePrescriptionContext();
  const handleCardClick = (id, genericname) => {
    const slug = generateSlug(genericname);
    router.push(`/Products/${slug}/${id}`);
  };

  console.log(data);

  return (
    <>
      <div className="responsive-mx mt-8 md:mt-24">
        <TitleSlider title={title} prevRef={prevRef} nextRef={nextRef} />

        {data?.length > 0 ? (
          <Swiper
            loop={true}
            onSwiper={setSwiperInstance}
            modules={[Navigation]}
            breakpoints={{
              0: { slidesPerView: 2, spaceBetween: 20 },
              640: { slidesPerView: 3, spaceBetween: 20 },
              768: { slidesPerView: 4, spaceBetween: 20 },
              1024: { slidesPerView: 5, spaceBetween: 30 },
            }}
            className="mySwiper"
          >
            {data.map((product) => (
              <SwiperSlide key={product.id}>
                <div className=" min-h-[350px] bg-white flex flex-col justify-between">
                  <div
                    onClick={() =>
                      handleCardClick(product?.id, product?.genericname)
                    }
                    className="bg-gray-100 cursor-pointer sm:py-5 px-5 p-4 sm:h-72 h-36 rounded-md flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={product.images?.[0] || fallbackImage}
                      alt={product.genericname || "Product Image"}
                      className="object-contain h-full w-full"
                    />
                  </div>

                  {/* Product details */}
                  <div className="mt-2 px-2">
                    <DetailsCard product={product} />
                  </div>

                  {/* Add to Cart */}
                  <div className="mt-4 px-2 pb-2">
                    <AddToCart title="Add To Cart" productDetails={product} className="text-xs flex items-center gap-3 rounded-full font-medium py-1.5 justify-center text-black bg-gray-200/50 cursor-pointer w-full" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center text-gray-500 mt-6">
            🚫 No Products Available
          </div>
        )}
        {isOpen && <Prescription />}
      </div>
    </>
  );
};

export default SwiperSlider;
