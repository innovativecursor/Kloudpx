// "use client";

// import React from "react";
// import useModal from "@/app/hooks/useModal";
// import { usePrescriptionContext } from "@/app/contexts/PrescriptionContext";

// const Prescription = () => {
//   const { isOpen, setIsOpen, modalRef } = useModal();
//   const { uploadedImage, uploadPrescription, loading } =
//     usePrescriptionContext();

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) uploadPrescription(file);
//   };

//   return (
//     <>
//       <div className="flex justify-center">
//         <div className="flex justify-center sm:mt-9 mt-6 md:w-1/2 w-[80%]">
//           <button
//             onClick={() => setIsOpen(true)}
//             className="bg-[#0070BA]/6 text-gray-600 hover:bg-[#0070BA]/20 hover:text-[#0070BA] w-full px-6 md:py-5 sm:py-3 py-2 rounded-md cursor-pointer md:text-sm text-xs font-medium flex justify-center gap-3 items-center"
//           >
//             <img
//               src="/assets/prescription.png"
//               alt="Upload"
//               className="w-6 h-6 object-contain"
//             />
//             Upload Prescription
//           </button>
//         </div>
//       </div>

//       {isOpen && (
//         <>
//           {loading && (
//             <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm flex items-center justify-center">
//               <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white"></div>
//             </div>
//           )}
//           <div className="fixed inset-0 bg-black/60 z-40"></div>
//           <div
//             ref={modalRef}
//             className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg z-50 w-full max-w-6xl"
//           >
//             <div className="grid md:grid-cols-2 grid-cols-1">
//               {/* Left: Upload */}
//               <div className="flex justify-center items-center tracking-wide p-8">
//                 <div>
//                   <h2 className="text-3xl dark-text font-semibold mb-2">
//                     Upload Prescription
//                   </h2>
//                   <p className="text-sm opacity-50 mt-4 font-medium mb-6">
//                     Please upload image of valid prescription from your doctor.
//                   </p>

//                   <div className="flex gap-5 mt-7 mb-6">
//                     <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#0070BA]/40 rounded-lg p-4 w-1/2 h-44 cursor-pointer hover:border-[#0070BA]">
//                       <img
//                         src="https://cdn-icons-png.flaticon.com/512/4147/4147103.png"
//                         alt="Upload New"
//                         className="w-20 h-20 mb-2"
//                       />
//                       <p className="text-base font-semibold dark-text">
//                         Upload New
//                       </p>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         className="hidden"
//                         onChange={handleFileChange}
//                         disabled={loading}
//                       />
//                     </label>
//                   </div>

//                   <hr className="border opacity-70 border-gray-300 mt-14 mb-10" />

//                   <p className="text-sm tracking-wide">
//                     <span className="font-bold text-color">Note:</span>
//                     <span className="opacity-50 font-medium">
//                       Always upload a clean version of your <br /> prescription
//                       for better result.
//                     </span>
//                   </p>
//                 </div>
//               </div>

//               {/* Right: Preview */}
//               <div className="bg-[#EDF6FD] rounded-xl py-12 px-9 flex flex-col items-center justify-center">
//                 <h3 className="text-2xl font-semibold mb-4 dark-text">
//                   Guide for a valid prescription
//                 </h3>
//                 <div className="w-full h-72 overflow-hidden rounded-md border border-gray-300 flex items-center justify-center">
//                   {uploadedImage ? (
//                     <img
//                       src={uploadedImage}
//                       alt="Prescription Preview"
//                       className="object-contain w-full h-full rounded-md"
//                     />
//                   ) : (
//                     <h1 className="text-center text-sm opacity-60">
//                       Upload Prescription
//                     </h1>
//                   )}
//                 </div>
//                 <div className="flex flex-col items-center justify-center tracking-wider mt-5">
//                   <p className="text-lg font-semibold text-gray-700 mt-2">
//                     Doctor Signature & Stamp:
//                   </p>
//                   <p className="text-center opacity-60 text-sm mt-2">
//                     The prescription with signature and stamp of doctor <br />
//                     to be considered valid.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default Prescription;

// "use client";

// import React, { useRef, useEffect } from "react";
// import { usePrescriptionContext } from "@/app/contexts/PrescriptionContext";

// const Prescription = () => {
//   const { isOpen, setIsOpen, uploadedImage, uploadPrescription, loading } = usePrescriptionContext();
//   const modalRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen, setIsOpen]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) uploadPrescription(file);
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       {loading && (
//         <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm flex items-center justify-center">
//           <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white"></div>
//         </div>
//       )}

//       <div className="fixed inset-0 bg-black/60 z-40"></div>

//       <div
//         ref={modalRef}
//         className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg z-50 w-full max-w-4xl p-6"
//       >
//         <button
//           onClick={() => setIsOpen(false)}
//           className="mb-4 text-gray-500 hover:text-gray-900 font-bold"
//         >
//           Close ✕
//         </button>

//         <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
//           <div className="flex flex-col justify-center items-center p-4">
//             <h2 className="text-3xl font-semibold mb-2">Upload Prescription</h2>
//             <p className="text-sm opacity-50 mt-4 font-medium mb-6 text-center">
//               Please upload image of valid prescription from your doctor.
//             </p>

//             <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#0070BA]/40 rounded-lg p-4 w-48 h-48 cursor-pointer hover:border-[#0070BA]">
//               <img
//                 src="https://cdn-icons-png.flaticon.com/512/4147/4147103.png"
//                 alt="Upload New"
//                 className="w-20 h-20 mb-2"
//               />
//               <p className="text-base font-semibold text-[#0070BA]">Upload New</p>
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleFileChange}
//                 disabled={loading}
//               />
//             </label>

//             <hr className="border opacity-70 border-gray-300 mt-8 mb-6 w-full" />

//             <p className="text-sm tracking-wide text-center">
//               <span className="font-bold text-[#0070BA]">Note:</span>{" "}
//               Always upload a clean version of your prescription for better result.
//             </p>
//           </div>

//           <div className="bg-[#EDF6FD] rounded-xl py-6 px-6 flex flex-col items-center justify-center">
//             <h3 className="text-2xl font-semibold mb-4">Guide for a valid prescription</h3>
//             <div className="w-full h-72 overflow-hidden rounded-md border border-gray-300 flex items-center justify-center">
//               {uploadedImage ? (
//                 <img
//                   src={uploadedImage}
//                   alt="Prescription Preview"
//                   className="object-contain w-full h-full rounded-md"
//                 />
//               ) : (
//                 <p className="text-center text-sm opacity-60">Upload Prescription</p>
//               )}
//             </div>
//             <div className="flex flex-col items-center justify-center tracking-wider mt-5">
//               <p className="text-lg font-semibold text-gray-700 mt-2">Doctor Signature & Stamp:</p>
//               <p className="text-center opacity-60 text-sm mt-2">
//                 The prescription with signature and stamp of doctor to be considered valid.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Prescription;

"use client";

import React, { useRef } from "react";
import { usePrescriptionContext } from "@/app/contexts/PrescriptionContext";

const Prescription = () => {
  const {
    isOpen,
    setIsOpen,
    uploadedImage,
    uploadPrescription,
    loading,
    pendingCartData,
    uploadedPrescriptionId,
  } = usePrescriptionContext();

  const modalRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadPrescription(file);
  };

  if (!isOpen) return null;

  console.log(uploadedImage, "datat is here");

  console.log(uploadedPrescriptionId, "id gett");

  return (
    <>
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white"></div>
        </div>
      )}

      {/* Backdrop - clicking this closes modal */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Modal content */}
      <div
        role="dialog"
        aria-modal="true"
        ref={modalRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg z-50 w-full max-w-4xl p-6"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
      >
        <button
          onClick={() => setIsOpen(false)}
          className="mb-4 text-gray-500 hover:text-gray-900 font-bold"
        >
          Close ✕
        </button>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
          {/* Left side - Upload */}
          <div className="flex flex-col justify-center items-center p-4">
            <h2 className="text-3xl font-semibold mb-2">Upload Prescription</h2>
            <p className="text-sm opacity-50 mt-4 font-medium mb-6 text-center">
              Please upload image of valid prescription from your doctor.
            </p>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#0070BA]/40 rounded-lg p-4 w-48 h-48 cursor-pointer hover:border-[#0070BA]">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4147/4147103.png"
                alt="Upload New"
                className="w-20 h-20 mb-2"
              />
              <p className="text-base font-semibold text-[#0070BA]">
                Upload New
              </p>
              {/* <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={loading}
              /> */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (file && pendingCartData) {
                    const { medicineid, quantity } = pendingCartData;
                    uploadPrescription(file, medicineid, quantity);
                  }
                }}
              />
            </label>

            <hr className="border opacity-70 border-gray-300 mt-8 mb-6 w-full" />

            <p className="text-sm tracking-wide text-center">
              <span className="font-bold text-[#0070BA]">Note:</span> Always
              upload a clean version of your prescription for better result.
            </p>
          </div>

          {/* Right side - Guide / Preview */}
          <div className="bg-[#EDF6FD] rounded-xl py-6 px-6 flex flex-col items-center justify-center">
            <h3 className="text-2xl font-semibold mb-4">
              Guide for a valid prescription
            </h3>
            <div className="w-full h-72 overflow-hidden rounded-md border border-gray-300 flex items-center justify-center">
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Prescription Preview"
                  className="object-contain w-full h-full rounded-md"
                />
              ) : (
                <p className="text-center text-sm opacity-60">
                  Upload Prescription
                </p>
              )}
            </div>
            <div className="flex flex-col items-center justify-center tracking-wider mt-5">
              <p className="text-lg font-semibold text-gray-700 mt-2">
                Doctor Signature & Stamp:
              </p>
              <p className="text-center opacity-60 text-sm mt-2">
                The prescription with signature and stamp of doctor to be
                considered valid.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Prescription;