// "use client";

// import React, { useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Thumbs } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/thumbs";

// import Zoom from "react-medium-image-zoom";
// import "react-medium-image-zoom/dist/styles.css";

// const ImageSwiper = ({ images }) => {
//   const [thumbsSwiper, setThumbsSwiper] = useState(null);
//   const fallbackImage = "/assets/fallback.png";
//   // const safeImages = images?.length > 0 ? images : [fallbackImage];
//   const filteredImages =
//     images?.filter((img) => img && img.trim() !== "") || [];
//   const safeImages =
//     filteredImages.length > 0 ? filteredImages : [fallbackImage];

//   return (
//     <div className="md:w-[50%]">
//       <div className="relative rounded-xl overflow-hidden">
//         <div className="flex flex-col pb-4 justify-center items-center bg-[#F4F8FB] pt-4 shadow-md w-full h-full">
//           <Swiper
//             spaceBetween={10}
//             navigation={false}
//             thumbs={{ swiper: thumbsSwiper }}
//             modules={[Navigation, Thumbs]}
//             className="w-full h-full"
//           >
//             {safeImages.map((img, index) => (
//               <SwiperSlide key={index}>
//                 <div className="flex justify-center items-center w-full sm:h-[80vh] h-[50vh] p-4 overflow-hidden">
//                   <Zoom>
//                     <img
//                       // src={img || fallbackImage}
//                        src={img && img.trim() !== "" ? img : fallbackImage}
//                       alt={`product-${index}`}
//                       className="max-w-full max-h-full "
//                     />
//                   </Zoom>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       </div>

//       {/* Thumbnail Swiper */}
//       <div className="mt-6 relative">
//         <div className="flex items-center justify-between px-2">
//           <button
//             className="bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center z-10"
//             id="thumb-prev"
//           >
//             <i className="ri-arrow-left-s-line text-xl"></i>
//           </button>

//           <Swiper
//             onSwiper={setThumbsSwiper}
//             spaceBetween={10}
//             slidesPerView={4}
//             watchSlidesProgress
//             navigation={{
//               nextEl: "#thumb-next",
//               prevEl: "#thumb-prev",
//             }}
//             modules={[Navigation, Thumbs]}
//             breakpoints={{
//               0: {
//                 slidesPerView: 3,
//               },
//               640: {
//                 slidesPerView: 4,
//               },
//             }}
//             className="w-full mx-2"
//           >
//             {safeImages.map((img, index) => (
//               <SwiperSlide key={index}>
//                 <img
//                   // src={img || fallbackImage}
//                    src={img && img.trim() !== "" ? img : fallbackImage}
//                   alt={`thumb-${index}`}
//                   className="w-[200px] h-[80px] object-contain p-1 bg-white cursor-pointer rounded-md border border-[#0070ba] transition-all duration-300"
//                 />
//               </SwiperSlide>
//             ))}
//           </Swiper>

//           <button
//             className="bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center z-10"
//             id="thumb-next"
//           >
//             <i className="ri-arrow-right-s-line text-xl"></i>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImageSwiper;














"use client";

import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ImageSwiper = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const fallbackImage = "/assets/fallback.png";

  // Mark client rendered
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter valid images - remove empty strings or invalid
  const filteredImages = images?.filter((img) => typeof img === "string" && img.trim() !== "") || [];
  const safeImages = filteredImages.length > 0 ? filteredImages : [fallbackImage];

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    if (thumbsSwiper && prevRef.current && nextRef.current) {
      thumbsSwiper.params.navigation.prevEl = prevRef.current;
      thumbsSwiper.params.navigation.nextEl = nextRef.current;
      thumbsSwiper.navigation.init();
      thumbsSwiper.navigation.update();
    }
  }, [thumbsSwiper]);

  // Helper component to render image or fallback if invalid
  const SafeImage = ({ src, alt, className }) => {
    if (typeof src !== "string" || src.trim() === "") {
      return <img src={fallbackImage} alt={alt} className={className} />;
    }
    return <img src={src} alt={alt} className={className} />;
  };

  return (
    <div className="md:w-[50%]">
      <div className="relative rounded-xl overflow-hidden">
        <div className="flex flex-col pb-4 justify-center items-center bg-[#F4F8FB] pt-4 shadow-md w-full h-full">
          <Swiper
            spaceBetween={10}
            navigation={false}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[Navigation, Thumbs]}
            className="w-full h-full"
          >
            {safeImages.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="flex justify-center items-center w-full sm:h-[80vh] h-[50vh] p-4 overflow-hidden">
                  <Zoom>
                    <SafeImage
                      src={img}
                      alt={`product-${index}`}
                      className="max-w-full max-h-full"
                    />
                  </Zoom>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Thumbnail Swiper with navigation buttons */}
      <div className="mt-6 relative">
        <div className="flex items-center justify-between px-2">
          <button
            ref={prevRef}
            className="bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center z-10"
            aria-label="Previous thumbnails"
          >
            <i className="ri-arrow-left-s-line text-xl"></i>
          </button>

          {isClient && (
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={4}
              watchSlidesProgress
              navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
              modules={[Navigation, Thumbs]}
              breakpoints={{
                0: { slidesPerView: 3 },
                640: { slidesPerView: 4 },
              }}
              className="w-full mx-2"
            >
              {safeImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <SafeImage
                    src={img}
                    alt={`thumb-${index}`}
                    className="w-[200px] h-[80px] object-contain p-1 bg-white cursor-pointer rounded-md border border-[#0070ba] transition-all duration-300"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          <button
            ref={nextRef}
            className="bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center z-10"
            aria-label="Next thumbnails"
          >
            <i className="ri-arrow-right-s-line text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageSwiper;
