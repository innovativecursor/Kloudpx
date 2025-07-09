"use client";

import React, { useEffect, useState } from "react";
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
  const { category, getItemsByCategory, getCategory } = useProductContext();
  const router = useRouter();

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleCategoryClick = async (id) => {
    setSelectedCategoryId(id);
    await getItemsByCategory(id);
    router.push(`/Products?category=${id}`);
  };

  useEffect(() => {
    getCategory();
  }, []);

  // console.log(category);

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
        {category.map((item, index) => {
          const IconComponent = getIconComponent(item.CategoryIcon?.Icon);

          return (
            <SwiperSlide key={item.ID || index} className="!w-auto">
              <div
                onClick={() => handleCategoryClick(item.ID)}
                className={`flex min-w-max md:px-5 px-2 gap-2 cursor-pointer transition-all duration-300 ease-in-out items-center justify-center whitespace-nowrap
                  ${
                    selectedCategoryId === item.ID
                      ? "text-[#0070ba]"
                      : "hover:text-[#0070ba]"
                  }`}
              >
                {IconComponent && (
                  <IconComponent className="sm:text-2xl text-base text-color" />
                )}
                <p className="sm:text-xs text-[11px] font-medium tracking-wide">
                  {item.CategoryName}
                </p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default TopItems;
