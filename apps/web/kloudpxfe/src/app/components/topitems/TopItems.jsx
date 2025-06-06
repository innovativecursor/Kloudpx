// "use client";

// import React, { useRef, useEffect, useState } from "react";
// import { motion } from "framer-motion";

// const TopItems = ({ items }) => {
//   const containerRef = useRef(null);
//   const [maxDrag, setMaxDrag] = useState(0);

//   useEffect(() => {
//     const updateMaxDrag = () => {
//       if (containerRef.current) {
//         const scrollWidth = containerRef.current.scrollWidth;
//         const offsetWidth = containerRef.current.offsetWidth;
//         setMaxDrag(scrollWidth - offsetWidth);
//       }
//     };

//     updateMaxDrag();

//     window.addEventListener("resize", updateMaxDrag);
//     return () => window.removeEventListener("resize", updateMaxDrag);
//   }, [items]);

//   return (
//     <motion.div
//       ref={containerRef}
//       className="flex overflow-x-hidden gap-6 py-4 scrollbar-hide cursor-grab"
//       initial={{ x: 100, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       transition={{ duration: 0.6, ease: "easeOut" }}
//       drag="x"
//       dragConstraints={{ left: -maxDrag, right: 0 }}
//       dragElastic={0.2}
//       whileTap={{ cursor: "grabbing" }}
//     >
//       {items.map((item, index) => (
//         <div
//           key={index}
//           className="flex items-center gap-2 w-44  px-4 rounded-lg cursor-pointer select-none"
//         >
//           <i className={`${item.iconClass} text-3xl text-blue-500`}></i>
//           <p className="text-sm font-normal text-center">{item.name}</p>
//         </div>
//       ))}
//     </motion.div>
//   );
// };

// export default TopItems;















// "use client";

// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";

// const TopItems = ({ items }) => {
//   return (
//     <Swiper
//       spaceBetween={16}
//       freeMode={true}
//       slidesPerView={5}
//       className="w-[90%]"
//     >
//       {items.map((item, index) => (
//         <SwiperSlide
//           key={index}
//           className="flex flex-col items-center justify-center gap-2 rounded-lg cursor-pointer select-none bg-blue-400 shadow-sm"
//         >
//           <i className={`${item.iconClass} text-3xl text-blue-500`}></i>
//           <p className="text-sm font-normal text-center">{item.name}</p>
//         </SwiperSlide>
//       ))}
//     </Swiper>
//   );
// };

// export default TopItems;






import React from 'react'

const TopItems = () => {
  return (
    <div>

    </div>
  )
}

export default TopItems
