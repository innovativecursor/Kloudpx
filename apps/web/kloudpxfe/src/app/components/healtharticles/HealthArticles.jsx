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























// components/HealthArticles.jsx
"use client";
import { FaArrowRight, FaRegCalendarAlt } from "react-icons/fa";

const articles = [
  {
    category: "Health Education",
    date: "May 15, 2023",
    title: "Understanding Antibiotic Resistance",
    description:
      "Learn about the growing concern of antibiotic resistance and how to use antibiotics responsibly.",
    image: "/antibiotic.jpg", // replace with actual image
    categoryColor: "bg-blue-100 text-blue-600",
  },
  {
    category: "Wellness",
    date: "April 28, 2023",
    title: "Managing Seasonal Allergies",
    description:
      "Effective strategies and medications to help you cope with seasonal allergies and enjoy the outdoors.",
    image: "/allergies.jpg", // replace with actual image
    categoryColor: "bg-blue-100 text-blue-600",
  },
];

export default function HealthArticles() {
  return (
    <section className="px-6 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Health Articles</h2>
        <a
          href="#"
          className="flex items-center text-blue-600 hover:underline gap-1"
        >
          View all <FaArrowRight size={14} />
        </a>
      </div>

      {/* Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col"
          >
            <img
              src={article.image}
              alt={article.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${article.categoryColor}`}
                >
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-gray-500 text-sm">
                  <FaRegCalendarAlt /> {article.date}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">{article.title}</h3>
              <p className="text-gray-600 flex-grow">{article.description}</p>
              <a
                href="#"
                className="mt-3 inline-flex items-center text-blue-600 font-medium hover:underline"
              >
                Read more <FaArrowRight className="ml-1" size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center mt-6 gap-2">
        <span className="w-3 h-3 rounded-full bg-blue-600"></span>
        <span className="w-3 h-3 rounded-full bg-gray-300"></span>
        <span className="w-3 h-3 rounded-full bg-gray-300"></span>
      </div>
    </section>
  );
}
