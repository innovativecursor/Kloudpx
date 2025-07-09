"use client";
import React, { useEffect } from "react";
import PrimaryButton from "../button/PrimaryButton";
import { useImageContext } from "@/app/contexts/ImagesContext";

const Category7 = () => {
  const { galleryImages, getGalleryImages } = useImageContext();

  const allImages = Array.isArray(galleryImages?.data)
    ? galleryImages.data
    : [];
  const imagesToShow = allImages.slice(0, 5);
  const leftImages = imagesToShow.slice(0, 4);
  const rightImage = imagesToShow[4];

  useEffect(() => {
    getGalleryImages();
  }, []);

  const ImageCard = ({ image, index }) => (
    <div
      className={`relative group overflow-hidden col-span-2 sm:col-span-1 ${
        index < 2 ? "h-[160px] sm:h-[220px]" : "h-[160px] sm:h-[250px]"
      }`}
    >
      <img
        src={image.ImageURL}
        alt={image.ButtonText || `Gallery ${index + 1}`}
        className="w-full h-full object-cover rounded-md  transition duration-300 group-hover:opacity-60"
      />
      <div className="absolute inset-0 flex items-center justify-center  opacity-0 group-hover:opacity-100 transition duration-300">
        <PrimaryButton title={image.ButtonText || "View"} />
      </div>
    </div>
  );

  // console.log(galleryImages);

  return (
    <div className="responsive-mx flex flex-col md:flex-row gap-3 md:gap-4 mt-8 md:mt-20">
      {/* Left Grid */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 cursor-pointer md:w-[70%]">
        {leftImages.map((img, i) => (
          <ImageCard key={img.ID} image={img} index={i} />
        ))}
      </div>

      {/* Right Image */}
      {rightImage && (
        <div className="relative group overflow-hidden md:w-[30%] h-[300px] md:h-auto">
          <img
            src={rightImage.ImageURL}
            alt={rightImage.ButtonText || "Gallery"}
            className="w-full h-full object-cover rounded-md transition cursor-pointer duration-300 group-hover:opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition duration-300">
            <PrimaryButton title={rightImage.ButtonText || "View"} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Category7;
