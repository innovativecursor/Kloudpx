// "use client";
// import React, { useEffect } from "react";
// import PrimaryButton from "../button/PrimaryButton";
// import { useImageContext } from "@/app/contexts/ImagesContext";

// const Category7 = () => {
//   const { galleryImages, getGalleryImages } = useImageContext();

//   const allImages = Array.isArray(galleryImages?.data)
//     ? galleryImages.data
//     : [];
//   const imagesToShow = allImages.slice(0, 5);
//   const leftImages = imagesToShow.slice(0, 4);
//   const rightImage = imagesToShow[4];

//   useEffect(() => {
//     getGalleryImages();
//   }, []);

//   // console.log(galleryImages);

//   const ImageCard = ({ image, index }) => (
//     <div
//       className={`relative group overflow-hidden shadow col-span-2 sm:col-span-1 
//         ${index < 2 ? "h-[160px] sm:h-[260px]" : "h-[160px] sm:h-[260px]"}
//       `}
//     >
//       <img
//         src={image.ImageURL}
//         alt={image.ButtonText || `Gallery ${index + 1}`}
//         className="w-full h-full  rounded-md  transition duration-300 "
//       />
//       <div className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer opacity-0 group-hover:opacity-100 transition duration-300">
//         <PrimaryButton title={rightImage.ButtonText || "View"} />
//       </div>
//     </div>
//   );

//   // console.log(galleryImages);

//   return (
//     <div className="responsive-mx flex  flex-col md:flex-row gap-3 md:gap-4 mt-10 md:mt-28">
//       {/* Left Grid */}
//       <div className="grid grid-cols-2 gap-3 md:gap-4 cursor-pointer md:w-[70%]">
//         {leftImages.map((img, i) => (
//           <ImageCard key={img.ID} image={img} index={i} />
//         ))}
//       </div>

//       {/* Right Image */}
//       {rightImage && (
//         <div className="relative group overflow-hidden md:w-[30%] h-[300px] md:h-auto">
//           <img
//             src={rightImage.ImageURL}
//             alt={rightImage.ButtonText || "Gallery"}
//             className="w-full h-full  rounded-md transition cursor-pointer duration-300 group-hover:opacity-60"
//           />
//           <div className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer opacity-0 group-hover:opacity-100 transition duration-300">
//             <PrimaryButton title={rightImage.ButtonText || "View"} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Category7;












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
      className={`relative group overflow-hidden shadow rounded-md 
        w-full h-[160px] sm:h-[260px]`}
    >
      <img
        src={image.ImageURL}
        alt={image.ButtonText || `Gallery ${index + 1}`}
        className="w-full h-full  rounded-md transition duration-300"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer opacity-0 group-hover:opacity-100 transition duration-300">
        <PrimaryButton title={image.ButtonText || "View"} />
      </div>
    </div>
  );

  return (
    <div className="responsive-mx mt-10 md:mt-28 sm:mt-16 mb-14 md:mb-24 sm:mb-16 lg:mb-28">
      {/* 🔹 Mobile Layout (<md) */}
      <div className="flex flex-col gap-4 md:hidden">
        {/* 2x2 Grid for First 4 */}
        <div className="grid grid-cols-2 gap-4">
          {leftImages.map((img, i) => (
            <ImageCard key={img.ID} image={img} index={i} />
          ))}
        </div>

        {/* 5th Image Full Width */}
        {rightImage && (
          <div className="w-full">
            <ImageCard image={rightImage} index={4} />
          </div>
        )}
      </div>

      {/* 🔹 Desktop Layout (md & up) */}
      <div className="hidden md:flex flex-row gap-4">
        {/* Left Grid */}
        <div className="grid grid-cols-2 gap-4 w-[70%]">
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
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer opacity-0 group-hover:opacity-100 transition duration-300">
              <PrimaryButton title={rightImage.ButtonText || "View"} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category7;
