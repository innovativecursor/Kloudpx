"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProductsCard = ({ productsData }) => {
  const router = useRouter();
  const fallbackImage = "/assets/demo.jpg";

  const handleCardClick = (id) => {
    router.push(`/Products/${id}`);
  };

  return (
    <div>
      <div className="grid lg:grid-cols-3 sm:gap-7 gap-10 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 mt-7 sm:mt-11 sm:mb-20 mb-12">
        {Array.isArray(productsData?.data) && productsData?.data.length > 0 ? (
          productsData?.data.map((item) => (
            <div
              key={item.ID}
              onClick={() => handleCardClick(item.ID)}
              className="w-full bg-white h-72 rounded cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <h1 className="mx-3.5 lg:text-xl mt-4 md:text-xl text-lg font-light">
                {item?.BrandName}
              </h1>

              <div className="flex justify-evenly mt-4 w-full mx-2">
                <div>
                  <Image
                    // src={
                    //   item.ItemImages && item.ItemImages.length > 0
                    //     ? item.ItemImages[0].url
                    //     : fallbackImage
                    // }
                    src={fallbackImage}
                    alt={item.BrandName}
                    width={160}
                    height={160}
                    className="rounded"
                  />
                </div>

                <div className="flex flex-col justify-center space-y-3">
                  <Image
                    // src={
                    //   item.ItemImages && item.ItemImages.length > 0
                    //     ? item.ItemImages[0].url
                    //     : fallbackImage
                    // }\
                    src={fallbackImage}
                    alt="thumb"
                    width={48}
                    height={48}
                    className="rounded"
                  />
                  <Image
                    // src={
                    //   item.ItemImages && item.ItemImages.length > 0
                    //     ? item.ItemImages[0].url
                    //     : fallbackImage
                    // }
                    src={fallbackImage}
                    alt="thumb"
                    width={48}
                    height={48}
                    className="rounded"
                  />
                  <div className="relative w-12 h-12 rounded overflow-hidden">
                    <Image
                      // src={
                      //   item.ItemImages && item.ItemImages.length > 0
                      //     ? item.ItemImages[0].url
                      //     : fallbackImage
                      // }
                      src={fallbackImage}
                      alt="thumb"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xl font-bold">
                      +20
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-start mt-3 mx-3.5 mb-2">
                <div>
                  <h1 className="text-xs font-medium">
                    {item.Category?.CategoryName || "No Category"}
                  </h1>
                  <p className="text-[12px] font-light opacity-70 mt-1">
                    {item.Description
                      ? item.Description.split(" ").slice(0, 5).join(" ")
                      : "No description"}
                    {item.Description &&
                      item.Description.split(" ").length > 5 && (
                        <span className="text-color"> ...more</span>
                      )}
                  </p>
                </div>

                <div className="flex gap-5 z-20">
                  <div className="bg-white shadow-md flex items-center justify-center -mt-8 w-9 h-9 rounded-full">
                    <i className="ri-heart-2-line text-2xl text-rose-600"></i>
                  </div>
                  <div className="bg-white shadow-md flex items-center justify-center -mt-8 w-9 h-9 rounded-full">
                    <i className="ri-whatsapp-line text-2xl text-green-600"></i>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">No products available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductsCard;
