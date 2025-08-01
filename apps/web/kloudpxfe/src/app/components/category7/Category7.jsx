"use client";
import React, { useEffect } from "react";
import PrimaryButton from "../button/PrimaryButton";
import { useImageContext } from "@/app/contexts/ImagesContext";

const Category7 = () => {
  const { galleryImages, getGalleryImages } = useImageContext();
  console.log(galleryImages);

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
      className={`relative group overflow-hidden shadow rounded-md 
        w-full h-full`}
    >
      <img
        src={image.ImageURL}
        alt={image.ButtonText || `Gallery ${index + 1}`}
        className="w-full h-full  rounded-md transition duration-300"
      />
      {/* <div className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer opacity-0 group-hover:opacity-100 transition duration-300">
        <PrimaryButton title={image.ButtonText || "View"} />
      </div> */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer opacity-0 group-hover:opacity-100 transition duration-300">
        {image.Link ? (
          <a href={image.Link} className="inline-block">
            <PrimaryButton title={image.ButtonText || "View"} />
          </a>
        ) : (
          <PrimaryButton title={image.ButtonText || "View"} />
        )}
      </div>
    </div>
  );

  return (
    <div className="responsive-mx mt-10 md:mt-28 sm:mt-16 mb-14 md:mb-24 sm:mb-16 lg:mb-28">
      <div className="flex flex-col md:gap-4 gap-2 md:hidden">
        <div className="grid grid-cols-2 md:gap-4 gap-2">
          {leftImages.map((img, i) => (
            <ImageCard key={img.ID} image={img} index={i} />
          ))}
        </div>
        {rightImage && (
          <div className="w-full mt-2">
            <ImageCard image={rightImage} index={4} />
          </div>
        )}
      </div>

      <div className="hidden md:flex flex-row md:gap-4 gap-2">
        <div className="grid grid-cols-2 md:gap-4 gap-2 w-[70%]">
          {leftImages.map((img, i) => (
            <ImageCard key={img.ID} image={img} index={i} />
          ))}
        </div>

        {/* Right Image */}
        {rightImage && (
          <div className="relative group overflow-hidden w-[30%] h-auto rounded-md">
            <img
              src={rightImage.ImageURL}
              alt={rightImage.ButtonText || "Gallery"}
              className="w-full h-full rounded-md transition duration-300 group-hover:opacity-60"
            />
            {/* <div className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer opacity-0 group-hover:opacity-100 transition duration-300">
              <PrimaryButton title={rightImage.ButtonText || "View"} />
            </div> */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer opacity-0 group-hover:opacity-100 transition duration-300">
              {rightImage.Link ? (
                <a href={rightImage.Link} className="inline-block">
                  <PrimaryButton title={rightImage.ButtonText || "View"} />
                </a>
              ) : (
                <PrimaryButton title={rightImage.ButtonText || "View"} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category7;
