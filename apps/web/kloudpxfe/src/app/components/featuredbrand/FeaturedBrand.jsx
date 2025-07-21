"use client";

import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import TitleSlider from "../titleslider/TitleSlider";
import useSwiperNavigation from "@/app/hooks/useSwiperNavigation";
import { useProductContext } from "@/app/contexts/ProductContext";
import useProductNavigation from "@/app/hooks/useProductNavigation";

const FeaturedBrand = () => {
  const { prevRef, nextRef, setSwiperInstance } = useSwiperNavigation();
  const { getAllFeature, feature } = useProductContext();
  const { goToProductPage } = useProductNavigation();
  const fallbackImage = "/assets/fallback.png";

  useEffect(() => {
    getAllFeature();
  }, []);

  // console.log(feature);

  return (
    <>
      {feature.length > 0 ? (
        <div>
          <TitleSlider
            title="Featured Brands"
            prevRef={prevRef}
            nextRef={nextRef}
          />
          <Swiper
            loop={true}
            onSwiper={setSwiperInstance}
            modules={[Navigation]}
            breakpoints={{
              0: { slidesPerView: 2, spaceBetween: 10 },
              640: { slidesPerView: 3, spaceBetween: 20 },
              768: { slidesPerView: 4, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
            }}
            className="mySwiper"
          >
            {feature.map(({ images, id, genericname }, index) => (
              <SwiperSlide key={id}>
                <div
                  onClick={() => goToProductPage(id, genericname)}
                  className="w-full h-20 sm:h-36 cursor-pointer lg:h-64 flex items-center justify-center p-2 rounded-lg overflow-hidden"
                >
                  {/* <img
                    src={images?.[0] || fallbackImage}
                    alt={`Brand ${index + 1}`}
                    className="w-full h-full "
                  /> */}
                  <img
                    src={images?.[0] || fallbackImage}
                    alt={`Brand ${index + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : null}
    </>
  );
};

export default FeaturedBrand;
