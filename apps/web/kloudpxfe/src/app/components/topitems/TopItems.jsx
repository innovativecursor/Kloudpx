"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import useSwiperNavigation from "@/app/hooks/useSwiperNavigation";
import { useProductContext } from "@/app/contexts/ProductContext";
import { useRouter } from "next/navigation";

import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as TbIcons from "react-icons/tb";
import * as MdIcons from "react-icons/md";
import * as BiIcons from "react-icons/bi";
import * as GiIcons from "react-icons/gi";
import { generateSlug } from "@/app/utils/slugify";

const getIconComponent = (iconName) => {
  if (!iconName) return null;
  const prefix = iconName.slice(0, 2);
  switch (prefix) {
    case "Fa":
      return FaIcons[iconName];
    case "Ai":
      return AiIcons[iconName];
    case "Tb":
      return TbIcons[iconName];
    case "Md":
      return MdIcons[iconName];
    case "Bi":
      return BiIcons[iconName];
    case "Gi":
      return GiIcons[iconName];
    default:
      return null;
  }
};

const TopItems = () => {
  const { prevRef, nextRef, setSwiperInstance } = useSwiperNavigation();
  const {
    category,
    getItemsByCategory,
    selectedCategoryId,
    setSelectedCategoryId,
    setSelectedCategoryName,
  } = useProductContext();
  const router = useRouter();

  const handleCategoryClick = async (id) => {
    const selected = category.find((cat) => cat.ID === id);
    setSelectedCategoryId(id);
    setSelectedCategoryName(selected?.CategoryName || "");
    await getItemsByCategory(id);
    const categorySlug =
      selected?.CategoryName?.toLowerCase().replace(/\s+/g, "-") || "";
    // router.push(`/Products?category=${id}&name=${categorySlug}`);
    router.push(`/Products?${categorySlug}&category=${id}`);
  };

  // console.log(category);

  return (
    <div className="w-full">
      {category.length > 0 ? (
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
          {category.map((item, index) => {
            const IconComponent = getIconComponent(item.CategoryIcon?.Icon);
            return (
              // <SwiperSlide key={item.ID || index} className="!w-auto">
              //   <div
              //     onClick={() => handleCategoryClick(item.ID)}
              //     className={`flex min-w-max md:px-5 px-2 gap-2 cursor-pointer transition-all duration-300 ease-in-out items-center justify-center whitespace-nowrap
              //     ${
              //       selectedCategoryId === item.ID
              //         ? "text-[#0070ba]"
              //         : "hover:text-[#0070ba]"
              //     }`}
              //   >
              //     {IconComponent && (
              //       <IconComponent className="md:text-3xl text-base text-color" />
              //     )}
              //     <p className="sm:text-sm text-[11px] font-medium tracking-wide">
              //       {item.CategoryName}
              //     </p>
              //   </div>
              // </SwiperSlide>

              <SwiperSlide key={item.ID || index} className="!w-auto">
                <div
                  onClick={() => handleCategoryClick(item.ID)}
                  className={`flex items-center justify-center min-w-max md:px-5 px-2 gap-2 cursor-pointer transition-all duration-300 ease-in-out whitespace-nowrap h-[60px]
    ${
      selectedCategoryId === item.ID ? "text-[#0070ba]" : "hover:text-[#0070ba]"
    }`}
                >
                  {IconComponent ? (
                    <IconComponent className="md:text-4xl text-base text-[#0070ba]" />
                  ) : (
                    <div className="md:text-2xl text-base w-[1em] h-[1em]" />
                  )}
                  <p className="sm:text-sm text-[11px] font-normal tracking-wide">
                    {item.CategoryName}
                  </p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <div className="text-center text-gray-500 mt-6">
          No Category Available at the Moment.
        </div>
      )}
    </div>
  );
};

export default TopItems;
