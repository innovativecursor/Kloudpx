// "use client";
// import React, { useState, useRef } from "react";
// import { motion } from "framer-motion";
// import { FaPlay } from "react-icons/fa";

// const Video = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const videoRef = useRef(null);

//   // Variants for animation
//   const containerVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.8,
//         ease: "easeOut",
//         staggerChildren: 0.2,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.8, ease: "easeOut" },
//     },
//   };

//   const handlePlay = () => {
//     setIsPlaying(true);
//     if (videoRef.current) {
//       videoRef.current.play();
//     }
//   };

//   return (
//     <motion.div
//       className="responsive-mx  lg:py-32 sm:py-8 py-6 md:mt-20 sm:mt-16 mt-11 flex flex-col justify-center items-start rounded-xl"
//       variants={containerVariants}
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true, amount: 0.3 }}
//     >
//       <motion.h1
//         className="font-semibold sm:text-4xl text-lg tracking-wide lg:pt-8 md:pt-5"
//         variants={itemVariants}
//       >
//         How <span className="text-color"> Kloud P&X</span> Works
//       </motion.h1>

//       <motion.p
//         className="font-normal text-gray-800 sm:mt-2 sm:text-[12px] text-[7px] md:text-sm"
//         variants={itemVariants}
//       >
//         Learn how easy it to get your medicines delivered safely and quickly.
//       </motion.p>

//       {/* Video wrapper with overlay */}
//       <div className="relative w-full lg:mt-7 mt-3">
//         <motion.video
//           ref={videoRef}
//           src="/video.webm"
//           className="w-full h-auto rounded-[16px]"
//           loop
//           playsInline
//           controls
//           muted
//           variants={itemVariants}
//         />

//         {/* Blue overlay */}
//         {!isPlaying && (
//           <div className="absolute inset-0 bg-[#001D57]/84 rounded-[16px] flex flex-col items-center justify-center text-white ">
//             <h2 className="text-lg md:text-3xl font-medium mb-6 text-center">
//               Video on how to order medicines.
//             </h2>
//             <button
//               onClick={handlePlay}
//               className="flex items-center gap-2 font-medium text-sm px-10 py-3.5 cursor-pointer border border-[#FFFFFF]/80 text-white  rounded-xs hover:bg-white hover:text-[#001D57] transition"
//             >
//               <FaPlay className="text-xs" /> WATCH 01:00
//             </button>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default Video;

"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import Image from "next/image";
import videoimage from "@/assets/videoimage.png";

const Video = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  // Variants for animation
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const handlePlay = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <motion.div
      className="responsive-mx md:mt-24 mt-10  flex flex-col justify-center items-start rounded-xl"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.h1
        className="font-semibold lg:text-4xl md:text-3xl text-lg tracking-wide "
        variants={itemVariants}
      >
        How <span className="text-color"> Kloud P&X</span> Works
      </motion.h1>

      <motion.p
        className="font-normal text-gray-800 sm:mt-2 sm:text-[12px] text-[7px] md:text-sm"
        variants={itemVariants}
      >
        Learn how easy it to get your medicines delivered safely and quickly.
      </motion.p>

      {/* Video wrapper with overlay */}
      <div className="relative w-full md:mt-7 mt-3">
        <motion.video
          ref={videoRef}
          src="/video.webm"
          className="w-full h-auto rounded-[16px]"
          loop
          playsInline
          controls
          muted
          variants={itemVariants}
        />

        {/* Image Overlay on top of Video */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center rounded-[16px] overflow-hidden">
            {/* Image on top of video */}
            <Image
              src={videoimage}
              alt="Video thumbnail"
              fill
              className="object-cover rounded-[16px]"
            />


            {/* Content on top */}
            <div className="absolute z-10 flex flex-col items-center justify-center text-white px-4">
              <h2 className="text-sm md:text-3xl font-medium md:mb-6 mb-3 text-center">
                Video on how to order medicines.
              </h2>
              <button
                onClick={handlePlay}
                className="flex items-center gap-2 font-medium md:text-sm text-xs px-6 py-2.5 md:px-10 md:py-3.5 cursor-pointer border border-[#FFFFFF]/80 text-white rounded-xs hover:bg-white hover:text-[#001D57] transition"
              >
                <FaPlay className="text-xs" /> WATCH 01:00
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Video;
