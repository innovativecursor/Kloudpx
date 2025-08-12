"use client";
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import otc1 from "@/assets/otc1.png";
import otc2 from "@/assets/otc2.png";
import otc3 from "@/assets/otc3.png";

const products = [
  {
    id: 1,
    category: "Supplements",
    title: "Vitamin C Supplement",
    price: 12.99,
    image: otc1,
  },
  {
    id: 2,
    category: "Medical Devices",
    title: "Digital Thermometer",
    price: 24.99,
    image: otc2,
  },
  {
    id: 3,
    category: "First Aid",
    title: "First Aid Kit",
    price: 19.99,
    image: otc3,
  },
  {
    id: 4,
    category: "Supplements",
    title: "Zinc Supplement",
    price: 14.5,
    image: otc2,
  },
];

const Otc = () => {
  return (
    <section className=" responsive-mx md:mt-20 sm:mt-16 mt-12">
      <div className="">
        {/* Header */}
        <div className="flex sm:justify-between justify-center items-center sm:mb-6 mb-4">
          <h2 className="sm:text-2xl  text-lg font-bold text-gray-900">
            OTC Medications & Supplements
          </h2>
          <div className="text-[#0070ba]  font-medium sm:flex hidden items-center gap-1 hover:underline">
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
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="bg-white mb-5 rounded-xl shadow-md  overflow-hidden hover:shadow-md transition">
                {/* Image */}
                <div className="relative w-full h-56">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-[#0070ba] font-medium">
                    {product.category}
                  </p>
                  <h3 className="text-base mt-1 font-semibold text-gray-900">
                    {product.title}
                  </h3>
                  <div className="flex justify-between items-center mt-4 mb-2">
                    <p className="text-gray-900 font-bold ">
                      ${product.price.toFixed(2)}
                    </p>
                    <button className=" cursor-pointer sm:text-xs text-[10px] px-6 bg-[#0070ba] text-white font-medium sm:py-3.5 py-2.5 rounded-full transition">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="sm:hidden flex justify-center items-center mt-4">
          <button className=" cursor-pointer text-xs px-10 bg-[#0070ba] text-white font-medium py-3 rounded-full transition">
            View All
          </button>
        </div>
      </div>
    </section>
  );
};

export default Otc;
