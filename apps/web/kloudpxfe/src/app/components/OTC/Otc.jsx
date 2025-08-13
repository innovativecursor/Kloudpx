"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useRouter } from "next/navigation";
import { useProductContext } from "@/app/contexts/ProductContext";
import AddToCart from "../button/AddToCart";
import useProductNavigation from "@/app/hooks/useProductNavigation";

const Otc = () => {
  const { getAllOtc, allOtc } = useProductContext();
  const fallbackImage = "/assets/fallback.png";
  const router = useRouter();
  const { goToProductPage } = useProductNavigation();
  useEffect(() => {
    getAllOtc();
  }, []);

  console.log(allOtc);

  const otcSlides = allOtc?.map((product) => {
    const price = product?.price || 0;
    const discountPercent = product?.discount
      ? parseFloat(product?.discount.replace("%", "")) || 0
      : 0;
    const discountedPrice = (price - (price * discountPercent) / 100).toFixed(
      2
    );

    return (
      <SwiperSlide key={product.id}>
        <div className="bg-white h-96 mb-5 cursor-pointer rounded-xl shadow-md overflow-hidden hover:shadow-md transition">
          {/* Image */}
          <div
            onClick={() => goToProductPage(product?.id, product?.genericname)}
            className="relative w-full cursor-pointer h-56"
          >
            <Image
              src={
                product?.images?.[0]?.trim() ? product?.images[0] : fallbackImage
              }
              alt={product.title || product.genericname}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-4">
            <div
              onClick={() => goToProductPage(product?.id, product?.genericname)}
            >
              <p className="text-xs text-[#0070ba] font-medium">
                {product?.brandname}
              </p>
              <h3 className="text-base mt-1 font-semibold text-gray-900">
                {product?.genericname}
              </h3>
            </div>

            <div className="flex justify-between items-center mt-4 mb-2">
              {discountPercent > 0 ? (
                <div>
                  <span className="text-gray-900 font-bold">
                    ₱{discountedPrice}
                  </span>
                  <span className="text-sm line-through text-gray-400 ml-2">
                    ₱{price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <p className="text-gray-900 font-bold"> ₱{price.toFixed(2)}</p>
              )}

              <AddToCart
                title="Add To Cart"
                productDetails={product}
                className="cursor-pointer sm:text-xs text-[10px] px-6 bg-[#0070ba] text-white font-medium sm:py-3 py-2 rounded-full transition"
              />
            </div>
          </div>
        </div>
      </SwiperSlide>
    );
  });

  return (
    <section className="responsive-mx lg:mt-32 md:mt-24 sm:mt-20 mt-16">
      <div>
        {/* Header */}
        <div className="flex sm:justify-between justify-center items-center sm:mb-8 mb-4">
          <h2 className="sm:text-2xl text-lg font-bold text-gray-900">
            OTC Medications & Supplements
          </h2>
          <div
            onClick={() => router.push("/Products")}
            className="text-[#0070ba] font-medium sm:flex hidden items-center gap-1 hover:underline"
          >
            View all <span>→</span>
          </div>
        </div>

        {/* Swiper Slider */}
        <Swiper
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {otcSlides}
        </Swiper>

        {/* Mobile View All Button */}
        <div className="sm:hidden flex justify-center items-center mt-4">
          <button
            onClick={() => router.push("/Products")}
            className="cursor-pointer text-xs px-10 bg-[#0070ba] text-white font-medium py-3 rounded-full transition"
          >
            View All
          </button>
        </div>
      </div>
    </section>
  );
};

export default Otc;
