// 'use client';

// import React from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';
// import { Navigation } from 'swiper/modules';
// import TitleSlider from '../titleslider/TitleSlider';
// import useSwiperNavigation from '@/app/hooks/useSwiperNavigation';

// const HealthArticles = ({ articles }) => {
//     const { prevRef, nextRef, setSwiperInstance } = useSwiperNavigation();

//     return (
//         <div className="responsive-mx mt-14 sm:mt-16 md:mt-28">
//             <TitleSlider title="Health Articles" prevRef={prevRef} nextRef={nextRef} />

//             <Swiper
//                 loop={true}
//                 onSwiper={setSwiperInstance}
//                 modules={[Navigation]}
//                 breakpoints={{
//                     0: { slidesPerView: 2, spaceBetween: 20 },
//                     640: { slidesPerView: 2, spaceBetween: 20 },
//                     768: { slidesPerView: 3, spaceBetween: 20 },
//                     1024: { slidesPerView: 4, spaceBetween: 20 },
//                 }}
//                 className="mySwiper"
//             >
//                 {articles.map((article) => (
//                     <SwiperSlide key={article.id}>
//                         <div>
//                             <img
//                                 src={article.image}
//                                 alt="Article"
//                                 className="object-contain"
//                             />
//                             <h1 className="mt-3 tracking-wide text-[10px] opacity-80">
//                                 Posted on - <span className="text-color">{article.date}</span>
//                             </h1>
//                             <h1 className="mt-2 text-[10px] font-medium tracking-wide">
//                                 {article.title}
//                             </h1>
//                             <span className="text-[10px] underline opacity-70 tracking-wide">
//                                 Read more
//                             </span>
//                         </div>
//                     </SwiperSlide>
//                 ))}
//             </Swiper>
//         </div>
//     );
// };

// export default HealthArticles;




"use client";
import { FaArrowRight, FaRegCalendarAlt } from "react-icons/fa";
import health from "@/assets/health.png";
import health1 from "@/assets/health1.png";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const articles = [
  {
    category: "Health Education",
    date: "May 15, 2023",
    title: "Understanding Antibiotic Resistance",
    description:
      "Learn about the growing concern of antibiotic resistance and how to use antibiotics responsibly.",
    image: health,
    categoryColor: "bg-[#CFEBFF] text-[#0070ba]",
  },
  {
    category: "Wellness",
    date: "April 28, 2023",
    title: "Managing Seasonal Allergies",
    description:
      "Effective strategies and medications to help you cope with seasonal allergies and enjoy the outdoors.",
    image: health1,
    categoryColor: "bg-[#CFEBFF] text-[#0070ba]",
  },
  {
    category: "Health Education",
    date: "May 15, 2023",
    title: "Understanding Antibiotic Resistance",
    description:
      "Learn about the growing concern of antibiotic resistance and how to use antibiotics responsibly.",
    image: health,
    categoryColor: "bg-[#CFEBFF] text-[#0070ba]",
  },
];

export default function HealthArticles() {
  return (
    <section className="responsive-mx lg:mt-24 md:mt-20 sm:mt-16 mt-11">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="sm:text-2xl text-xl font-bold">Health Articles</h2>
        <div className="flex items-center text-[#0070ba] sm:text-base text-xs cursor-pointer hover:underline gap-1">
          View all <FaArrowRight size={14} />
        </div>
      </div>

      {/* Swiper Slider with Pagination */}
      <Swiper
        spaceBetween={20}
        modules={[Pagination]}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
          bulletClass: "custom-bullet",
          bulletActiveClass: "custom-bullet-active",
        }}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 15 },
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 2, spaceBetween: 20 },
        }}
        className="pb-12"
      >
        {articles.map((article, idx) => (
          <SwiperSlide key={idx}>
            <div className="bg-white mb-2 rounded-xl shadow-sm overflow-hidden flex flex-col">
              <Image
                src={article.image}
                alt={article.title}
                className="h-full w-full object-cover"
                priority
              />
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full sm:text-xs text-[10px] font-medium ${article.categoryColor}`}
                  >
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500 text-xs">
                    <FaRegCalendarAlt /> {article.date}
                  </span>
                </div>
                <h3 className="sm:text-lg text-sm font-bold mt-2 mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 mt-2 sm:text-sm text-xs flex-grow">
                  {article.description}
                </p>
                <div className="mt-7 mb-4 inline-flex items-center text-[#0070ba] text-sm font-medium hover:underline">
                  Read more <FaArrowRight className="ml-1" size={14} />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div className="custom-pagination"></div>
      </Swiper>
    </section>
  );
}
