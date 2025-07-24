// "use client";

// import React, { useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Thumbs } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/thumbs";

// import InnerImageZoom from "react-inner-image-zoom";
// import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";

// const ImageSwiper = ({ images }) => {
//   const [thumbsSwiper, setThumbsSwiper] = useState(null);
//   const fallbackImage = "/assets/fallback.png";
//   const safeImages = images?.length > 0 ? images : [fallbackImage];

//   return (
//     <div className="md:w-[50%] ">
//       <div className="relative rounded-xl overflow-hidden">
//         <div className="flex flex-col pb-4 justify-center items-center bg-gray-800 shadow-md w-full h-full">
//           <Swiper
//             spaceBetween={10}
//             navigation={false}
//             thumbs={{ swiper: thumbsSwiper }}
//             modules={[Navigation, Thumbs]}
//             className="w-full h-full"
//           >
//             {safeImages.map((img, index) => (
//               <SwiperSlide key={index}>
//                 <div className="flex justify-center items-center w-full h-[50vh] p-4">
//                   {" "}
//                   <InnerImageZoom
//                     src={img || fallbackImage}
//                     zoomSrc={img || fallbackImage}
//                     zoomType="hover"
//                     zoomPreload={true}
//                     zoomScale={1.5}
//                     alt={`product-${index}`}
//                     className="max-w-full max-h-full object-contain"
//                   />
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
//                   src={img || fallbackImage}
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

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ImageSwiper = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const fallbackImage = "/assets/fallback.png";
  const safeImages = images?.length > 0 ? images : [fallbackImage];

  return (
    <div className="md:w-[50%]">
      <div className="relative rounded-xl overflow-hidden">
        <div className="flex flex-col pb-4 justify-center items-center bg-gray-50 shadow-md w-full h-full">
          <Swiper
            spaceBetween={10}
            navigation={false}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[Navigation, Thumbs]}
            className="w-full h-full"
          >
            {safeImages.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="flex justify-center items-center w-full h-[80vh] p-4 overflow-hidden">
                  <Zoom>
                    <img
                      src={img || fallbackImage}
                      alt={`product-${index}`}
                      className="max-w-full max-h-full "
                    />
                  </Zoom>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Thumbnail Swiper */}
      <div className="mt-6 relative">
        <div className="flex items-center justify-between px-2">
          <button
            className="bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center z-10"
            id="thumb-prev"
          >
            <i className="ri-arrow-left-s-line text-xl"></i>
          </button>

          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            watchSlidesProgress
            navigation={{
              nextEl: "#thumb-next",
              prevEl: "#thumb-prev",
            }}
            modules={[Navigation, Thumbs]}
            breakpoints={{
              0: {
                slidesPerView: 3,
              },
              640: {
                slidesPerView: 4,
              },
            }}
            className="w-full mx-2"
          >
            {safeImages.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img || fallbackImage}
                  alt={`thumb-${index}`}
                  className="w-[200px] h-[80px] object-contain p-1 bg-white cursor-pointer rounded-md border border-[#0070ba] transition-all duration-300"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            className="bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center z-10"
            id="thumb-next"
          >
            <i className="ri-arrow-right-s-line text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageSwiper;
