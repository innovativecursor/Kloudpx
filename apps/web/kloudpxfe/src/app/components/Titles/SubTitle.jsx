"use client";
import React from "react";
import { useRouter } from "next/navigation";

const SubTitle = ({ paths }) => {
  const router = useRouter();

  const pathRoutes = {
    Home: "/",
    Cart: "/",
    Checkout: "/Checkout",
    Address: "/Address",
    "Delivery Type": "/Delivery",
  };

  const handleClick = (item) => {
    const route = pathRoutes[item];
    if (route) {
      router.push(route);
    }
  };

  return (
    <div className="opacity-60 text-xs font-medium cursor-pointer uppercase flex flex-wrap gap-1">
      {paths.map((item, index) => (
        <span
          key={index}
          onClick={() => handleClick(item)}
          className="hover:text-blue-600"
        >
          {item}
          {index !== paths.length - 1 && (
            <i className="ri-arrow-right-s-line mx-1"></i>
          )}
        </span>
      ))}
    </div>
  );
};

export default SubTitle;
