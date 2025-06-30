// "use client";

// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import { Navigation } from "swiper/modules";
// import useSwiperNavigation from "@/app/hooks/useSwiperNavigation";
// import { useProductContext } from "@/app/contexts/ProductContext";
// import { useRouter } from "next/navigation";

// const TopItems = () => {
//   const { prevRef, nextRef, setSwiperInstance } = useSwiperNavigation();
//   const { category, getItemsByCategory } = useProductContext();
//   const router = useRouter();
//   const handleCategoryClick = async (id) => {
//     await getItemsByCategory(id);
//     router.push(`/Products?category=${id}`);
//   };

//   return (
//     <div className="w-full">
//       <Swiper
//         loop={true}
//         modules={[Navigation]}
//         onSwiper={setSwiperInstance}
//         navigation={{
//           prevEl: prevRef.current,
//           nextEl: nextRef.current,
//         }}
//         spaceBetween={10}
//         slidesPerView="auto"
//         className="w-full"
//       >
//         {category.data.map((item, index) => (
//           <SwiperSlide key={item.ID || index} className="!w-auto">
//             <div
//               onClick={() => handleCategoryClick(item.ID)}
//               className="flex min-w-max md:px-5 px-2 cursor-pointer hover:text-[#0070ba] transition-all duration-300 ease-in-out items-center justify-center whitespace-nowrap"
//             >
//               <p className="sm:text-xs text-[11px] font-medium tracking-wide">
//                 {item.CategoryName}
//               </p>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default TopItems;







"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import useSwiperNavigation from "@/app/hooks/useSwiperNavigation";
import { useProductContext } from "@/app/contexts/ProductContext";
import { useRouter } from "next/navigation";

const TopItems = () => {
  const { prevRef, nextRef, setSwiperInstance } = useSwiperNavigation();
  const { category, getItemsByCategory } = useProductContext();
  const router = useRouter();

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleCategoryClick = async (id) => {
    setSelectedCategoryId(id); 
    await getItemsByCategory(id);
    router.push(`/Products?category=${id}`);
  };

  return (
    <div className="w-full">
      <Swiper
        loop={true}
        modules={[Navigation]}
        onSwiper={setSwiperInstance}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        spaceBetween={10}
        slidesPerView="auto"
        className="w-full"
      >
        {category.data.map((item, index) => (
          <SwiperSlide key={item.ID || index} className="!w-auto">
            <div
              onClick={() => handleCategoryClick(item.ID)}
              className={`flex min-w-max md:px-5 px-2 cursor-pointer transition-all duration-300 ease-in-out items-center justify-center whitespace-nowrap
                ${selectedCategoryId === item.ID ? "text-[#0070ba]" : "hover:text-[#0070ba]"}`}
            >
              <p className="sm:text-xs text-[11px] font-medium tracking-wide">
                {item.CategoryName}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TopItems;
