// "use client";
// import React, { useState } from "react";
// import { MdOutlineBackup } from "react-icons/md";
// import { IoQrCodeOutline } from "react-icons/io5";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";

// const Upload = () => {
//   const qr = "/assets/qr.png";
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   return (
//     <div className="responsive-mx md:mt-20 sm:mt-16 mt-11 relative">
//       <Swiper
//         spaceBetween={20}
//         slidesPerView={1.2}
//         breakpoints={{
//           640: {
//             slidesPerView: 1.5,
//           },
//           768: {
//             slidesPerView: 2,
//           },
//           1024: {
//             slidesPerView: 2,
//           },
//         }}
//       >
//         {/* Upload Prescription Card */}
//         <SwiperSlide>
//           <div className="bg-[#EBF7FF] border border-[#0070ba] rounded-3xl sm:h-80 h-64 lg:p-8 md:p-6 p-4 flex flex-col items-center justify-center text-center">
//             <div className="bg-[#0070ba] rounded-full tracking-wide sm:p-4 p-2 mb-4">
//               <MdOutlineBackup className="text-white sm:text-2xl text-xl" />
//             </div>
//             <h3 className="font-semibold sm:text-sm text-xs mb-2 text-black">
//               Upload Prescription
//             </h3>
//             <p className="text-[#0070ba] font-medium sm:text-xs text-[9px]">
//               Skip the Wait – Order Online with Your Prescription!
//             </p>

//             <button className="bg-[#0070ba] text-white font-light mt-4 px-8 sm:py-3 py-2.5 rounded-full sm:text-sm text-xs transition">
//               Upload Now
//             </button>
//           </div>
//         </SwiperSlide>

//         {/* QR Code Payment Card */}
//         <SwiperSlide>
//           <div className="bg-[#EBF7FF] border lg:mr-1 border-[#0070ba] rounded-3xl sm:h-80 h-64 lg:p-8 md:p-6 p-4 flex flex-col items-center justify-center text-center">
//             <div className="bg-[#0070ba] rounded-full tracking-wide sm:p-4 p-2 mb-4">
//               <IoQrCodeOutline className="text-white sm:text-2xl text-xl" />
//             </div>
//             <h3 className="font-semibold sm:text-sm text-xs mb-2 text-black">
//               Save this QR for easy Payments
//             </h3>
//             <p className="text-[#0070ba] font-medium sm:text-xs text-[9px]">
//               Quick Pay, More Savings – Use Our QR Code!
//             </p>

//             <button
//               onClick={openModal}
//               className="bg-[#0070ba] cursor-pointer text-white font-light mt-4 px-8 sm:py-3 py-2.5 rounded-full sm:text-sm text-xs transition"
//             >
//               Get QR code
//             </button>
//           </div>
//         </SwiperSlide>
//       </Swiper>

//       {/* Modal */}
//       {isModalOpen && (
//         <div
//           className="fixed inset-0 bg-black/30 cursor-pointer flex items-center justify-center z-50"
//           onClick={closeModal}
//         >
//           <div
//             className="bg-white cursor-pointer rounded-xl p-6 max-w-sm w-[90%] relative"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={closeModal}
//               className="absolute top-3 cursor-pointer right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
//               aria-label="Close modal"
//             >
//               &times;
//             </button>

//             <h2 className="text-sm font-semibold mb-4 text-center">
//               Pay via this QR Code!
//             </h2>

//             <img src={qr} alt="QR Code" className="mx-auto" />
//             <h2 className="text-xs  font-light  mt-4 text-center">
//               Quick Pay, More Savings – Use Our QR Code!
//             </h2>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Upload;












// Upload.jsx
"use client";
import React, { useState } from "react";
import { MdOutlineBackup } from "react-icons/md";
import { IoQrCodeOutline } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// Add this import - path adjust karo apne project ke hisaab se
import { usePrescriptionContext } from "@/app/contexts/PrescriptionContext";
import Prescription from "../modal/Prescription";

const Upload = () => {
  const { setIsOpen } = usePrescriptionContext(); 

  const qr = "/assets/qr.png";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Function to open prescription modal
  const openPrescriptionModal = () => setIsOpen(true);

  return (
    <>
    <div className="responsive-mx md:mt-20 sm:mt-16 mt-11 relative">
      <Swiper
        spaceBetween={20}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 2 },
        }}
      >
        {/* Upload Prescription Card */}
        <SwiperSlide>
          <div className="bg-[#EBF7FF] border border-[#0070ba] rounded-3xl sm:h-80 h-64 lg:p-8 md:p-6 p-4 flex flex-col items-center justify-center text-center">
            <div className="bg-[#0070ba] rounded-full tracking-wide sm:p-4 p-2 mb-4">
              <MdOutlineBackup className="text-white sm:text-2xl text-xl" />
            </div>
            <h3 className="font-semibold sm:text-sm text-xs mb-2 text-black">
              Upload Prescription
            </h3>
            <p className="text-[#0070ba] font-medium sm:text-xs text-[9px]">
              Skip the Wait – Order Online with Your Prescription!
            </p>

            {/* Change this button's onClick */}
            <button
              onClick={openPrescriptionModal}  // <-- Yahan call karo
              className="bg-[#0070ba] text-white font-light mt-4 px-8 sm:py-3 py-2.5 rounded-full sm:text-sm text-xs transition"
            >
              Upload Now
            </button>
          </div>
        </SwiperSlide>

        {/* QR Code Payment Card */}
        <SwiperSlide>
          {/* unchanged QR code card */}
          <div className="bg-[#EBF7FF] border lg:mr-1 border-[#0070ba] rounded-3xl sm:h-80 h-64 lg:p-8 md:p-6 p-4 flex flex-col items-center justify-center text-center">
            <div className="bg-[#0070ba] rounded-full tracking-wide sm:p-4 p-2 mb-4">
              <IoQrCodeOutline className="text-white sm:text-2xl text-xl" />
            </div>
            <h3 className="font-semibold sm:text-sm text-xs mb-2 text-black">
              Save this QR for easy Payments
            </h3>
            <p className="text-[#0070ba] font-medium sm:text-xs text-[9px]">
              Quick Pay, More Savings – Use Our QR Code!
            </p>

            <button
              onClick={openModal}
              className="bg-[#0070ba] cursor-pointer text-white font-light mt-4 px-8 sm:py-3 py-2.5 rounded-full sm:text-sm text-xs transition"
            >
              Get QR code
            </button>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* QR modal unchanged */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/30 cursor-pointer flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white cursor-pointer rounded-xl p-6 max-w-sm w-[90%] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 cursor-pointer right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 className="text-sm font-semibold mb-4 text-center">
              Pay via this QR Code!
            </h2>

            <img src={qr} alt="QR Code" className="mx-auto" />
            <h2 className="text-xs  font-light  mt-4 text-center">
              Quick Pay, More Savings – Use Our QR Code!
            </h2>
          </div>
        </div>
      )}
    </div>

    <Prescription />
    </>
  );
};

export default Upload;
